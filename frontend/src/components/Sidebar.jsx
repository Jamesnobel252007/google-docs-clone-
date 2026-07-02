import {
    LayoutDashboard,
    FileText,
    Share2,
    Star,
    Trash2,
    Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Documents", path: "/documents", icon: <FileText size={18} /> },
        { name: "Shared", path: "/shared", icon: <Share2 size={18} /> },
        { name: "Favorites", path: "/favorites", icon: <Star size={18} /> },
    ];

    const utilityItems = [
        { name: "Trash", path: "/trash", icon: <Trash2 size={18} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0">
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-11 w-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black shadow-md text-xs">
                        VD
                    </div>

                    <div>
                        <div className="font-bold text-slate-900 text-base leading-none">
                            VDocs
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                            Workspace
                        </div>
                    </div>
                </div>

                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                    <div className="h-px bg-slate-100 my-4" />

                    {utilityItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;