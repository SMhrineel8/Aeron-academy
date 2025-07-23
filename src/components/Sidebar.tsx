// src/components/Sidebar.tsx
import React from 'react';
import { BookOpen, HelpCircle, BarChart3, X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (section: 'courses' | 'quiz' | 'rankings') => void;
    activeSection: 'courses' | 'quiz' | 'rankings';
    sidebarRef: React.RefObject<HTMLDivElement>;
}

export default function Sidebar({ isOpen, onClose, onNavigate, activeSection, sidebarRef }: SidebarProps) {
    const navItems = [
        { name: 'Courses', icon: BookOpen, section: 'courses' },
        { name: 'Quiz', icon: HelpCircle, section: 'quiz' },
        { name: 'Rankings', icon: BarChart3, section: 'rankings' },
    ];

    return (
        <div
            ref={sidebarRef}
            className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:shadow-none lg:bg-transparent`}
        >
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8 lg:hidden">
                    <h2 className="text-2xl font-bold text-purple-700">Menu</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.section}
                            onClick={() => onNavigate(item.section as 'courses' | 'quiz' | 'rankings')}
                            className={`flex items-center w-full p-3 rounded-lg text-lg font-medium transition-colors
                            ${activeSection === item.section
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className="w-6 h-6 mr-3" />
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-200">
                    {/* Add any footer links or user info here if needed */}
                </div>
            </div>
        </div>
    );
}
