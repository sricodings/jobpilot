import { useState, useEffect } from 'react';
import type { JobApplication } from '../types';

const STORAGE_KEY = 'job_tracker_data';

export function useJobStore() {
    const [jobs, setJobs] = useState<JobApplication[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    }, [jobs]);

    const addJob = (job: JobApplication) => {
        setJobs((prev) => [job, ...prev]);
    };

    const updateJob = (id: string, updatedJob: Partial<JobApplication>) => {
        setJobs((prev) =>
            prev.map((job) => (job.id === id ? { ...job, ...updatedJob } : job))
        );
    };

    const deleteJob = (id: string) => {
        setJobs((prev) => prev.filter((job) => job.id !== id));
    };

    const importJobs = (newJobs: JobApplication[]) => {
        setJobs((prev) => {
            // Avoid duplicates based on ID
            const existingIds = new Set(prev.map(j => j.id));
            const uniqueNewJobs = newJobs.filter(j => !existingIds.has(j.id));
            return [...uniqueNewJobs, ...prev];
        });
    };

    return { jobs, addJob, updateJob, deleteJob, importJobs };
}
