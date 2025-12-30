import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Kanban } from './components/Kanban';
import { Stats } from './components/Stats';
import { HabitDashboard } from './components/HabitDashboard';
import { AddJobModal } from './components/AddJobModal';
import { AddHabitModal } from './components/AddHabitModal';
import { useJobStore } from './hooks/useJobStore';
import { useHabitStore } from './hooks/useHabitStore';
import type { JobApplication, Habit } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('is_authenticated') === 'true';
  });

  const [currentView, setCurrentView] = useState<'table' | 'kanban' | 'stats' | 'habits'>('table');
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | undefined>(undefined);

  const { jobs, addJob, updateJob, deleteJob, importJobs } = useJobStore();
  const { habits, addHabit, toggleHabitForDate, deleteHabit } = useHabitStore();

  // Check for URL params from Extension
  const processedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (processedRef.current) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add') {
      processedRef.current = true;

      const newJob: JobApplication = {
        id: uuidv4(),
        companyName: params.get('companyName') || 'Unknown',
        jobTitle: params.get('jobTitle') || 'Unknown Role',
        location: params.get('location') || 'Remote',
        ctc: params.get('ctc') || 'Not disclosed',
        status: (params.get('status') as any) || 'Applied',
        appliedDate: params.get('appliedDate') || new Date().toISOString().split('T')[0],
        link: params.get('link') || '',
        notes: 'Added via AI Agent'
      };

      addJob(newJob);

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);

      setTimeout(() => {
        toast.success(`Successfully added application for ${newJob.companyName}!`);
      }, 500);
    }
  }, [addJob, isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('is_authenticated', 'true');
    toast.success('Welcome back SRI!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_authenticated');
    toast('Logged out successfully', { icon: '👋' });
  };

  const handleAddClick = () => {
    if (currentView === 'habits') {
      setIsHabitModalOpen(true);
    } else {
      setEditingJob(undefined);
      setIsJobModalOpen(true);
    }
  };

  const handleEditClick = (job: JobApplication) => {
    setEditingJob(job);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = (job: JobApplication) => {
    if (editingJob) {
      updateJob(job.id, job);
      toast.success('Job updated successfully');
    } else {
      addJob(job);
      toast.success('Job added successfully');
    }
  };

  const handleSaveHabit = (habit: Habit) => {
    addHabit(habit);
    toast.success('Habit added successfully');
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#0a192f',
            color: '#ccd6f6',
            border: '1px solid #233554',
          },
        }} />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <Layout
      currentView={currentView}
      setCurrentView={setCurrentView}
      onAddClick={handleAddClick}
    >
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#0a192f',
          color: '#ccd6f6',
          border: '1px solid #233554',
        },
      }} />
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold inline-block text-cyan-500">
            {currentView === 'table' && 'All Applications'}
            {currentView === 'kanban' && 'Board View'}
            {currentView === 'stats' && 'Analytics Overview'}
            {currentView === 'habits' && 'Habit Tracker'}
          </h2>
          <p className="text-slate-500">
            {currentView === 'table' && 'Manage and track all your job applications in one place.'}
            {currentView === 'kanban' && 'Visualize your progress through different stages.'}
            {currentView === 'stats' && 'Insights into your job search performance.'}
            {currentView === 'habits' && 'Build better routines and track your daily goals.'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-red-400 bg-red-400/5 hover:bg-red-400/40 rounded-lg transition-all"
        >
          Logout
        </button>
      </div>

      {currentView === 'table' && (
        <Dashboard
          jobs={jobs}
          onEdit={handleEditClick}
          onDelete={(id) => {
            deleteJob(id);
            toast.success('Job deleted');
          }}
          onImport={(newJobs) => {
            importJobs(newJobs);
            toast.success(`Imported ${newJobs.length} jobs successfully`);
          }}
        />
      )}

      {currentView === 'kanban' && (
        <Kanban
          jobs={jobs}
          onEdit={handleEditClick}
        />
      )}

      {currentView === 'stats' && (
        <Stats jobs={jobs} />
      )}

      {currentView === 'habits' && (
        <HabitDashboard
          habits={habits}
          onToggle={toggleHabitForDate}
          onDelete={(id) => {
            deleteHabit(id);
            toast.success('Habit deleted');
          }}
        />
      )}

      <AddJobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSave={handleSaveJob}
        initialData={editingJob}
      />

      <AddHabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onSave={handleSaveHabit}
      />
    </Layout>
  );
}

export default App;
