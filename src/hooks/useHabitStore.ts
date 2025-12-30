import { useState, useEffect } from 'react';
import type { Habit } from '../types';

const STORAGE_KEY = 'habit_tracker_data';

export function useHabitStore() {
    const [habits, setHabits] = useState<Habit[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }, [habits]);

    const addHabit = (habit: Habit) => {
        setHabits((prev) => [habit, ...prev]);
    };

    const updateHabit = (id: string, updatedHabit: Partial<Habit>) => {
        setHabits((prev) =>
            prev.map((habit) => (habit.id === id ? { ...habit, ...updatedHabit } : habit))
        );
    };

    const deleteHabit = (id: string) => {
        setHabits((prev) => prev.filter((habit) => habit.id !== id));
    };

    const toggleHabitForDate = (id: string, date: string) => {
        setHabits((prev) =>
            prev.map((habit) => {
                if (habit.id !== id) return habit;

                const isCompleted = habit.completedDates.includes(date);
                let newCompletedDates = isCompleted
                    ? habit.completedDates.filter((d) => d !== date)
                    : [...habit.completedDates, date];

                // Simple streak calculation (consecutive days ending today/yesterday)
                // Sort dates descending
                newCompletedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

                let streak = 0;
                const today = new Date().toISOString().split('T')[0];
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

                // If today is completed, start counting from today. 
                // If not, start from yesterday (to maintain streak if not done yet today).

                // If neither today nor yesterday is completed, streak is 0 (unless we just unchecked today, handled by logic)
                // Actually, simpler logic: iterate back from most recent date.
                // If most recent is today or yesterday, count backwards.

                if (newCompletedDates.length > 0) {
                    const latest = newCompletedDates[0];
                    // If the latest completion was before yesterday, streak is broken/zero for display purposes (though we keep history)
                    // But for "current streak", we usually mean consecutive days up to now.

                    // Let's just recount from the latest date backwards
                    let current = new Date(latest);
                    let count = 0;

                    for (const d of newCompletedDates) {
                        if (d === current.toISOString().split('T')[0]) {
                            count++;
                            current.setDate(current.getDate() - 1);
                        } else {
                            break;
                        }
                    }

                    // Only count this as valid current streak if the latest date is today or yesterday
                    if (latest === today || latest === yesterday) {
                        streak = count;
                    } else {
                        streak = 0;
                    }
                }

                return {
                    ...habit,
                    completedDates: newCompletedDates,
                    streak,
                };
            })
        );
    };

    return { habits, addHabit, updateHabit, deleteHabit, toggleHabitForDate };
}
