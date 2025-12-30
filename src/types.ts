export type Status = 'Selected' | 'Applied' | 'Pending' | 'Rejected' | 'Progress' | 'Interview';

export interface JobApplication {
    id: string;
    companyName: string;
    location: string;
    jobTitle: string;
    ctc: string; // Cost to Company
    status: Status;
    appliedDate: string;
    notes?: string;
    link?: string;
    isFavorite?: boolean;
}

export type HabitCategory = 'Learning' | 'Health' | 'Work' | 'Personal';

export interface Habit {
    id: string;
    title: string;
    category: HabitCategory;
    streak: number;
    completedDates: string[]; // ISO date strings YYYY-MM-DD
    targetPerWeek?: number;
}

export const STATUS_COLORS: Record<Status, string> = {
    'Selected': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Applied': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Rejected': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'Progress': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Interview': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export const CATEGORY_COLORS: Record<HabitCategory, string> = {
    'Learning': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'Health': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Work': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Personal': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};
