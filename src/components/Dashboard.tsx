import { useState, type ChangeEvent } from 'react';
import { STATUS_COLORS } from '../types';
import type { JobApplication } from '../types';
import { MapPin, Building2, IndianRupee, Calendar, ExternalLink, Trash2, Download, Upload } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

interface DashboardProps {
    jobs: JobApplication[];
    onEdit: (job: JobApplication) => void;
    onDelete: (id: string) => void;
    onImport: (jobs: JobApplication[]) => void;
}

export function Dashboard({ jobs, onEdit, onDelete, onImport }: DashboardProps) {
    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(jobs.map(job => ({
            'Company Name': job.companyName,
            'Location': job.location,
            'Job Title': job.jobTitle,
            'CTC': job.ctc,
            'Status': job.status,
            'Applied Date': job.appliedDate,
            'Link': job.link || '',
            'Notes': job.notes || ''
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Applications");
        XLSX.writeFile(wb, "job_applications.xlsx");
    };

    const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            const newJobs: JobApplication[] = data.map((row: any) => ({
                id: uuidv4(),
                companyName: row['Company Name'] || 'Unknown',
                location: row['Location'] || 'Remote',
                jobTitle: row['Job Title'] || 'Software Engineer',
                ctc: row['CTC'] || 'Not disclosed',
                status: row['Status'] || 'Applied',
                appliedDate: row['Applied Date'] || new Date().toISOString().split('T')[0],
                link: row['Link'],
                notes: row['Notes']
            }));

            onImport(newJobs);
        };
        reader.readAsBinaryString(file);
    };

    const [aiEnabled, setAiEnabled] = useState(true);
    const [waveKey, setWaveKey] = useState(0);

    const toggleAiAgent = () => {
        setAiEnabled(prev => !prev);
        setWaveKey(prev => prev + 1);
    };

    return (
        <div className="space-y-6 relative">
            {/* Water Wave Effect - Re-renders on key change to restart animation */}
            {waveKey > 0 && (
                <div
                    key={waveKey}
                    className={`water-wave active ${!aiEnabled ? 'disabled' : ''}`}
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={toggleAiAgent}
                        className="flex items-center gap-3 bg-navy-900 p-2 rounded-xl border border-navy-800 hover:border-cyan-400/30 transition-all cursor-pointer group"
                    >
                        <span className="text-sm font-bold text-slate-300 pl-2 group-hover:text-cyan-400 transition-colors">AI Agent</span>
                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${aiEnabled ? 'bg-cyan-400' : 'bg-navy-700'}`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-navy-950 rounded-full transition-transform duration-300 ${aiEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                        <span className={`text-xs font-bold pr-2 w-8 text-center ${aiEnabled ? 'text-cyan-400' : 'text-navy-500'}`}>
                            {aiEnabled ? 'ON' : 'OFF'}
                        </span>
                    </button>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={handleExport}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-navy-800 text-cyan-400 rounded-xl hover:bg-navy-700 transition-colors border border-navy-700 font-medium text-sm"
                    >
                        <Download size={16} />
                        <span className="md:inline">Export</span>
                    </button>
                    <label className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-cyan-400 text-navy-950 rounded-xl hover:bg-cyan-500 transition-colors font-bold text-sm cursor-pointer shadow-lg shadow-cyan-400/20">
                        <Upload size={16} strokeWidth={2.5} />
                        <span className="md:inline">Import</span>
                        <input type="file" accept=".xlsx, .xls" onChange={handleImport} className="hidden" />
                    </label>
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 border border-dashed border-navy-700 rounded-3xl bg-navy-900/30">
                    <div className="bg-navy-800 p-6 rounded-full mb-6 shadow-xl shadow-navy-950/50">
                        <Building2 size={48} className="text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">No applications yet</h3>
                    <p className="text-navy-50 max-w-sm leading-relaxed">
                        Start tracking your job search journey by adding your first application or importing an Excel file.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-navy-900 border border-navy-800 rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-navy-950/50 border-b border-navy-800">
                                        <th className="px-8 py-5 text-xs font-bold text-cyan-400 uppercase tracking-wider">Company</th>
                                        <th className="px-8 py-5 text-xs font-bold text-cyan-400 uppercase tracking-wider">Role</th>
                                        <th className="px-8 py-5 text-xs font-bold text-cyan-400 uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-5 text-xs font-bold text-cyan-400 uppercase tracking-wider">CTC</th>
                                        <th className="px-8 py-5 text-xs font-bold text-cyan-400 uppercase tracking-wider">Applied</th>
                                        <th className="px-8 py-5 text-xs font-bold text-cyan-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-800">
                                    {jobs.map((job) => (
                                        <tr
                                            key={job.id}
                                            className="hover:bg-navy-800/50 transition-all duration-200 group cursor-pointer"
                                            onClick={() => onEdit(job)}
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-cyan-400 font-bold text-xl shadow-lg group-hover:shadow-cyan-400/10 group-hover:border-cyan-400/30 transition-all">
                                                        {job.companyName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-100 text-lg">{job.companyName}</div>
                                                        <div className="flex items-center gap-1.5 text-xs text-navy-50 mt-1 font-medium">
                                                            <MapPin size={12} className="text-cyan-400" />
                                                            {job.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-semibold text-slate-200">{job.jobTitle}</div>
                                                {job.link && (
                                                    <a href={job.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mt-1">
                                                        View Job <ExternalLink size={10} />
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${STATUS_COLORS[job.status]}`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                                                    <IndianRupee size={14} className="text-emerald-400" />
                                                    {job.ctc}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-navy-50 text-sm">
                                                    <Calendar size={14} className="text-navy-600" />
                                                    {format(new Date(job.appliedDate), 'MMM d, yyyy')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(job.id);
                                                    }}
                                                    className="p-2 text-red-400 bg-red-400/10 hover:bg-red-400/40 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => onEdit(job)}
                                className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg active:scale-[0.98] transition-transform"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-cyan-400 font-bold text-lg">
                                            {job.companyName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-100">{job.companyName}</h3>
                                            <div className="text-xs text-navy-50 flex items-center gap-1">
                                                <MapPin size={10} className="text-cyan-400" />
                                                {job.location}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[job.status]}`}>
                                        {job.status}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="font-medium text-slate-200 text-sm">{job.jobTitle}</div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-1 text-slate-300">
                                            <IndianRupee size={12} className="text-emerald-400" />
                                            {job.ctc}
                                        </div>
                                        <div className="flex items-center gap-1 text-navy-400 text-xs">
                                            <Calendar size={12} />
                                            {format(new Date(job.appliedDate), 'MMM d')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-navy-800">
                                    {job.link ? (
                                        <a href={job.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-xs text-cyan-400 flex items-center gap-1">
                                            View Job <ExternalLink size={10} />
                                        </a>
                                    ) : <span></span>}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(job.id);
                                        }}
                                        className="p-2 text-red-400 bg-red-400/10 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
