import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { JobApplication } from '../types';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface AddJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (job: JobApplication) => void;
    initialData?: JobApplication;
}

export function AddJobModal({ isOpen, onClose, onSave, initialData }: AddJobModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<JobApplication>({
        defaultValues: initialData || {
            status: 'Applied',
            appliedDate: new Date().toISOString().split('T')[0],
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset(initialData || {
                status: 'Applied',
                appliedDate: new Date().toISOString().split('T')[0],
            });
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = (data: JobApplication) => {
        onSave({
            ...data,
            id: initialData?.id || uuidv4(),
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
                className="bg-navy-900 rounded-3xl shadow-2xl border border-navy-800 w-full max-w-lg overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-navy-800">
                    <h2 className="text-xl font-bold text-slate-100">
                        {initialData ? 'Edit Application' : 'New Application'}
                    </h2>
                    <button onClick={onClose} className="text-navy-50 hover:text-slate-100 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Company Name</label>
                            <input
                                {...register('companyName', { required: 'Required' })}
                                className="w-full px-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 placeholder-navy-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                                placeholder="e.g. Google"
                            />
                            {errors.companyName && <span className="text-xs text-rose-400">{errors.companyName.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Location</label>
                            <input
                                {...register('location', { required: 'Required' })}
                                className="w-full px-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 placeholder-navy-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                                placeholder="e.g. Bangalore"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Job Title</label>
                        <input
                            {...register('jobTitle', { required: 'Required' })}
                            className="w-full px-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 placeholder-navy-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                            placeholder="e.g. Senior Frontend Engineer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">CTC</label>
                            <input
                                {...register('ctc', { required: 'Required' })}
                                className="w-full px-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 placeholder-navy-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                                placeholder="e.g. 24 LPA"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all appearance-none"
                            >
                                {['Applied', 'Pending', 'Interview', 'Progress', 'Selected', 'Rejected'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Date Applied</label>
                        <input
                            type="date"
                            {...register('appliedDate')}
                            className="w-full px-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
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
                            {initialData ? 'Update' : 'Add Application'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
