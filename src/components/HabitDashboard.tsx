import { format, subDays, isSameDay } from 'date-fns';
import type { Habit } from '../types';
import { CATEGORY_COLORS } from '../types';
import { motion } from 'framer-motion';
import { Check, Flame, Trash2 } from 'lucide-react';

interface HabitDashboardProps {
    habits: Habit[];
    onToggle: (id: string, date: string) => void;
    onDelete: (id: string) => void;
}

export function HabitDashboard({ habits, onToggle, onDelete }: HabitDashboardProps) {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => {
                    return (
                        <motion.div
                            key={habit.id}
                            layoutId={habit.id}
                            className="bg-navy-900 p-6 rounded-3xl shadow-lg border border-navy-800 group relative overflow-hidden hover:border-cyan-400/30 transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border ${CATEGORY_COLORS[habit.category]}`}>
                                        {habit.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-100">{habit.title}</h3>
                                </div>
                                <div className="flex items-center gap-1.5 text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-xl border border-orange-400/20">
                                    <Flame size={18} className={habit.streak > 0 ? 'fill-orange-400' : ''} />
                                    <span className="font-bold text-sm">{habit.streak}</span>
                                </div>
                            </div>

                            {/* Weekly Progress */}
                            <div className="flex justify-between items-center mb-8 bg-navy-950/50 p-3 rounded-2xl border border-navy-800">
                                {last7Days.map((date) => {
                                    const dateStr = format(date, 'yyyy-MM-dd');
                                    const isCompleted = habit.completedDates.includes(dateStr);
                                    const isToday = isSameDay(date, today);

                                    return (
                                        <div key={dateStr} className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] text-navy-50 font-medium uppercase">
                                                {format(date, 'EEEEE')}
                                            </span>
                                            <button
                                                onClick={() => onToggle(habit.id, dateStr)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                    ? 'bg-cyan-400 text-navy-950 shadow-[0_0_10px_rgba(100,255,218,0.4)] scale-110'
                                                    : isToday
                                                        ? 'bg-navy-800 border-2 border-cyan-400/50 text-navy-600 hover:border-cyan-400'
                                                        : 'bg-navy-800 text-navy-700 hover:bg-navy-700'
                                                    }`}
                                            >
                                                {isCompleted && <Check size={16} strokeWidth={4} />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-navy-800">
                                <div className="text-xs text-navy-50 font-medium">
                                    Target: <span className="text-slate-200">{habit.targetPerWeek} days/week</span>
                                </div>
                                <button
                                    onClick={() => onDelete(habit.id)}
                                    className="p-2 text-navy-600 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}

                {habits.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-navy-800 rounded-3xl bg-navy-900/20">
                        <div className="bg-navy-800 p-5 rounded-full shadow-lg mb-4">
                            <Flame size={40} className="text-navy-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-2">No habits yet</h3>
                        <p className="text-navy-50 max-w-xs leading-relaxed">
                            Start building better routines by adding your first habit.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
