import React, { useState } from 'react';
import { LayoutDashboard, Kanban, Plus, PieChart, Menu, X, CheckCircle, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
    currentView: 'table' | 'kanban' | 'stats' | 'habits';
    setCurrentView: (view: 'table' | 'kanban' | 'stats' | 'habits') => void;
    onAddClick: () => void;
}

export function Layout({ children, currentView, setCurrentView, onAddClick }: LayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'table', label: 'Applications', icon: LayoutDashboard },
        { id: 'kanban', label: 'Board', icon: Kanban },
        { id: 'stats', label: 'Analytics', icon: PieChart },
        { id: 'habits', label: 'Habits', icon: CheckCircle },
    ] as const;

    return (
        <div className="min-h-screen bg-navy-950 flex font-sans text-navy-100 selection:bg-cyan-400/30 selection:text-cyan-400">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-navy-900 border-r border-navy-800 fixed h-full z-20 shadow-xl">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-400/20">
                            <Flame className="text-navy-950 fill-navy-950" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                            SRI Job<span className="text-cyan-400">Tracker</span>
                        </h1>
                    </div>
                    <p className="text-xs text-navy-50 pl-14 font-medium tracking-wide uppercase opacity-60">Level Up Your Career</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentView(item.id)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-navy-800 text-cyan-400 shadow-lg shadow-navy-950/50'
                                    : 'text-navy-50 hover:bg-navy-800 hover:text-cyan-400'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full"
                                    />
                                )}
                                <item.icon size={22} className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-navy-50 group-hover:text-cyan-400'}`} />
                                <span className="font-medium tracking-wide">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-navy-800 bg-navy-900/50 backdrop-blur-sm">
                    <button
                        onClick={onAddClick}
                        className="w-full flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-navy-950 px-4 py-4 rounded-xl shadow-lg shadow-cyan-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold tracking-wide"
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span>{currentView === 'habits' ? 'New Habit' : 'New Application'}</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-navy-900/90 backdrop-blur-md border-b border-navy-800 z-30 px-4 py-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                        <Flame className="text-navy-950 fill-navy-950" size={18} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-100">
                        Job<span className="text-cyan-400">Tracker</span>
                    </h1>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-navy-100 hover:bg-navy-800 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed inset-0 top-16 bg-navy-900 z-20 p-4 space-y-2 border-t border-navy-800"
                    >
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setCurrentView(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${currentView === item.id
                                    ? 'bg-navy-800 text-cyan-400'
                                    : 'text-navy-50 hover:bg-navy-800'
                                    }`}
                            >
                                <item.icon size={22} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                onAddClick();
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-cyan-400 text-navy-950 px-4 py-4 rounded-xl mt-6 font-bold"
                        >
                            <Plus size={20} strokeWidth={3} />
                            <span>{currentView === 'habits' ? 'New Habit' : 'New Application'}</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-4 md:p-10 pt-24 md:pt-10 overflow-x-hidden min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-navy-800/20 via-navy-950 to-navy-950">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
