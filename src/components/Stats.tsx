import type { JobApplication, Status } from '../types';
import { motion } from 'framer-motion';
import { BarChart, Activity, CheckCircle, XCircle, TrendingUp, Award } from 'lucide-react';

interface StatsProps {
    jobs: JobApplication[];
}

export function Stats({ jobs }: StatsProps) {
    const total = jobs.length;
    const selected = jobs.filter(j => j.status === 'Selected').length;
    const rejected = jobs.filter(j => j.status === 'Rejected').length;
    const interview = jobs.filter(j => j.status === 'Interview').length;

    const successRate = total > 0 ? Math.round((selected / total) * 100) : 0;

    // Calculate Average CTC
    const ctcValues = jobs
        .map(j => {
            const match = j.ctc.match(/(\d+(\.\d+)?)/);
            return match ? parseFloat(match[0]) : 0;
        })
        .filter(val => val > 0);

    const avgCtc = ctcValues.length > 0
        ? (ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length).toFixed(1)
        : '0';

    // Find Top Application (Highest CTC)
    const topJob = [...jobs].sort((a, b) => {
        const getVal = (s: string) => {
            const match = s.match(/(\d+(\.\d+)?)/);
            return match ? parseFloat(match[0]) : 0;
        };
        return getVal(b.ctc) - getVal(a.ctc);
    })[0];

    const stats = [
        { label: 'Total Applications', value: total, icon: BarChart, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
        { label: 'Interviews', value: interview, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
        { label: 'Selected', value: selected, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
        { label: 'Rejected', value: rejected, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
    ];

    return (
        <div className="space-y-8">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-navy-900 p-6 rounded-2xl shadow-lg border border-navy-800 hover:border-navy-700 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl border ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className="text-4xl font-bold text-slate-100">{stat.value}</span>
                        </div>
                        <p className="text-navy-50 font-medium tracking-wide text-sm uppercase opacity-80">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Advanced Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-blue-600 to-cyan-600 p-1 rounded-2xl shadow-xl shadow-cyan-900/20"
                >
                    <div className="bg-navy-900/90 h-full p-6 rounded-xl backdrop-blur-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-cyan-400 font-bold mb-1 uppercase tracking-wider text-xs">Success Rate</p>
                                <h3 className="text-5xl font-bold text-white">{successRate}%</h3>
                            </div>
                            <div className="p-2 bg-cyan-400/10 rounded-lg">
                                <TrendingUp size={24} className="text-cyan-400" />
                            </div>
                        </div>
                        <p className="text-sm text-navy-100 opacity-70">
                            Conversion from application to offer
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-navy-900 p-6 rounded-2xl shadow-lg border border-navy-800"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-navy-50 font-bold mb-1 uppercase tracking-wider text-xs">Average CTC</p>
                            <h3 className="text-4xl font-bold text-slate-100">{avgCtc}<span className="text-lg text-navy-600 font-normal ml-1">LPA</span></h3>
                        </div>
                        <div className="p-2 bg-emerald-400/10 rounded-lg">
                            <span className="text-emerald-400 font-bold text-xl">₹</span>
                        </div>
                    </div>
                    <p className="text-sm text-navy-50 opacity-60">
                        Based on {ctcValues.length} applications with CTC data
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-navy-900 p-6 rounded-2xl shadow-lg border border-navy-800"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-navy-50 font-bold mb-1 uppercase tracking-wider text-xs">Top Opportunity</p>
                            <h3 className="text-xl font-bold text-slate-100 truncate max-w-[180px]">
                                {topJob ? topJob.companyName : 'N/A'}
                            </h3>
                        </div>
                        <div className="p-2 bg-amber-400/10 rounded-lg">
                            <Award size={24} className="text-amber-400" />
                        </div>
                    </div>
                    {topJob && (
                        <div className="space-y-1">
                            <p className="text-sm text-cyan-400 font-medium">{topJob.jobTitle}</p>
                            <p className="text-sm text-navy-50 opacity-60">CTC: {topJob.ctc}</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-navy-900 p-8 rounded-3xl shadow-lg border border-navy-800">
                <h3 className="text-lg font-bold text-slate-100 mb-8">Application Status Distribution</h3>
                <div className="space-y-6">
                    {(['Applied', 'Pending', 'Interview', 'Progress', 'Selected', 'Rejected'] as Status[]).map((status) => {
                        const count = jobs.filter(j => j.status === status).length;
                        const percentage = total > 0 ? (count / total) * 100 : 0;

                        return (
                            <div key={status} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-navy-100">{status}</span>
                                    <span className="text-navy-50">{count} ({Math.round(percentage)}%)</span>
                                </div>
                                <div className="h-2.5 bg-navy-950 rounded-full overflow-hidden border border-navy-800">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)] ${status === 'Selected' ? 'bg-emerald-500 shadow-emerald-500/50' :
                                                status === 'Rejected' ? 'bg-rose-500 shadow-rose-500/50' :
                                                    status === 'Interview' ? 'bg-orange-500 shadow-orange-500/50' :
                                                        'bg-cyan-500 shadow-cyan-500/50'
                                            }`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
