import { STATUS_COLORS } from '../types';
import type { JobApplication, Status } from '../types';
import { motion } from 'framer-motion';
import { MapPin, IndianRupee } from 'lucide-react';

interface KanbanProps {
    jobs: JobApplication[];
    onEdit: (job: JobApplication) => void;
}

const COLUMNS: Status[] = ['Applied', 'Pending', 'Interview', 'Progress', 'Selected', 'Rejected'];

export function Kanban({ jobs, onEdit }: KanbanProps) {
    const getJobsByStatus = (status: Status) => jobs.filter((job) => job.status === status);

    return (
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-thin scrollbar-thumb-navy-700 scrollbar-track-transparent">
            {COLUMNS.map((status) => {
                const statusJobs = getJobsByStatus(status);

                return (
                    <div key={status} className="min-w-[320px] flex-shrink-0 snap-center">
                        <div className="flex items-center justify-between mb-4 px-1 sticky top-0 bg-navy-950/95 backdrop-blur-sm py-2 z-10">
                            <h3 className="font-bold text-slate-200 tracking-wide">{status}</h3>
                            <span className="bg-navy-800 text-cyan-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-navy-700">
                                {statusJobs.length}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {statusJobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    layoutId={job.id}
                                    onClick={() => onEdit(job)}
                                    className="bg-navy-900 p-5 rounded-2xl shadow-lg border border-navy-800 hover:border-cyan-400/50 hover:shadow-cyan-400/5 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-center text-cyan-400 font-bold text-sm shadow-inner">
                                            {job.companyName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${STATUS_COLORS[status].split(' ')[0].replace('bg-', 'bg-')}`} />
                                    </div>

                                    <h4 className="font-bold text-slate-100 mb-1 text-lg group-hover:text-cyan-400 transition-colors">{job.companyName}</h4>
                                    <p className="text-sm text-navy-50 mb-4 font-medium">{job.jobTitle}</p>

                                    <div className="flex items-center gap-4 text-xs text-navy-50/70 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={12} className="text-cyan-400" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <IndianRupee size={12} className="text-emerald-400" />
                                            {job.ctc}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {statusJobs.length === 0 && (
                                <div className="h-32 border-2 border-dashed border-navy-800 rounded-2xl flex items-center justify-center text-navy-700 text-sm font-medium bg-navy-900/20">
                                    Empty
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
