import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Habit } from '../types';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface AddHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (habit: Habit) => void;
}

export function AddHabitModal({ isOpen, onClose, onSave }: AddHabitModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Habit>();

    useEffect(() => {
        if (isOpen) {
            reset({
                title: '',
                category: 'Personal',
                targetPerWeek: 7,
            });
        }
    }, [isOpen, reset]);

    const onSubmit = (data: Habit) => {
        onSave({
            ...data,
            id: uuidv4(),
            streak: 0,
            completedDates: [],
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-navy-900 rounded-3xl shadow-2xl border border-navy-800 w-full max-w-md overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-navy-800">
                    <h2 className="text-xl font-bold text-slate-100">New Habit</h2>
                    <button onClick={onClose} className="text-navy-50 hover:text-slate-100 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Habit Title</label>
                        <input
                            {...register('title', { required: 'Required' })}
                            className="w-full px-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 placeholder-navy-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                            placeholder="e.g. Read 30 mins"
                        />
                        {errors.title && <span className="text-xs text-rose-400">{errors.title.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Category</label>
                        <select
                            {...register('category')}
                            className="w-full px-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all appearance-none"
                        >
                            {['Learning', 'Health', 'Work', 'Personal'].map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Weekly Target (Days)</label>
                        <input
                            type="number"
                            min="1"
                            max="7"
                            {...register('targetPerWeek', { required: 'Required', min: 1, max: 7 })}
                            className="w-full px-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 placeholder-navy-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-navy-100 bg-navy-800 hover:bg-navy-700 rounded-xl font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 text-navy-950 bg-cyan-400 hover:bg-cyan-500 rounded-xl font-bold shadow-lg shadow-cyan-400/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Start Habit
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
