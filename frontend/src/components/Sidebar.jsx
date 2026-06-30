import React from 'react'
import { useState } from 'react'
import { LayoutDashboard, FileText, Share2, Star, Trash2, Settings } from 'lucide-react';
import { Link,useLocation } from 'react-router-dom';



const Sidebar = () => {


    const [menuOpen, setMenuOpen] = useState(false); // Can be used for mobile toggle  

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Documents', path: '/documents', icon: <FileText size={18} /> },
        { name: 'Shared', path: '/shared', icon: <Share2 size={18} /> },
        { name: 'Favorites', path: '/favorites', icon: <Star size={18} /> },
    ];

    const utilityItems = [
        { name: 'Trash', path: '/trash', icon: <Trash2 size={18} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
    ];

const location = useLocation();

    return (
        <section>

            <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0">
                <div className="p-5 flex flex-col flex-grow">

                    {/* VDocs Branding Accent */}
                    <div className="flex items-center space-x-3 mb-8 px-1">
                        <div className="h-11 w-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-blue-200/50 text-xs tracking-wider flex-shrink-0">
                            VD
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-900 tracking-tight text-base leading-none">VDocs</span>
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold mt-1">Workspace</span>
                        </div>
                    </div>

                    {/* Core Nav Links Stack */}
                    <nav className="flex flex-col space-y-1 flex-grow">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`w-full flex items-center space-x-15 px-4 py-2.5 text-xl font-medium rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-blue-50 text-blue-600 font-semibold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                                        {item.icon}
                                    </span>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                        {/* Section Divider */}
                        <div className="h-px bg-slate-100 my-4 mx-2" />

                        {/* Utility Stack */}
                        {utilityItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`w-full flex items-center my-10 space-x-15 px-4 py-12 text-xl font-medium rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-blue-50 text-blue-600 font-semibold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                                        {item.icon}
                                    </span>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
          

        </section>
    )
}

export default Sidebar
