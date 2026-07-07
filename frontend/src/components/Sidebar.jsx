// import {
//     LayoutDashboard,
//     FileText,
//     Share2,
//     Star,
//     Trash2,
//     Settings,
// } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";

// const Sidebar = () => {
//     const location = useLocation();

//     const navItems = [
//         { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
//         { name: "Documents", path: "/documents", icon: <FileText size={18} /> },
//         { name: "Shared", path: "/shared", icon: <Share2 size={18} /> },
//         { name: "Favorites", path: "/favorites", icon: <Star size={18} /> },
//     ];

//     const utilityItems = [
//         { name: "Trash", path: "/trash", icon: <Trash2 size={18} /> },
//         { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
//     ];

//     return (
//         <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0">
//             <div className="p-5 flex flex-col flex-grow">
//                 <div className="flex items-center gap-3 mb-8">
//                     <div className="h-11 w-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black shadow-md text-xs">
//                         VD
//                     </div>

//                     <div>
//                         <div className="font-bold text-slate-900 text-base leading-none">
//                             VDocs
//                         </div>
//                         <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
//                             Workspace
//                         </div>
//                     </div>
//                 </div>

//                 <nav className="flex flex-col gap-1">
//                     {navItems.map((item) => {
//                         const isActive = location.pathname === item.path;

//                         return (
//                             <Link
//                                 key={item.name}
//                                 to={item.path}
//                                 className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition ${isActive
//                                         ? "bg-blue-50 text-blue-600"
//                                         : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                                     }`}
//                             >
//                                 <span className={isActive ? "text-blue-600" : "text-slate-400"}>
//                                     {item.icon}
//                                 </span>
//                                 <span>{item.name}</span>
//                             </Link>
//                         );
//                     })}

//                     <div className="h-px bg-slate-100 my-4" />

//                     {utilityItems.map((item) => {
//                         const isActive = location.pathname === item.path;

//                         return (
//                             <Link
//                                 key={item.name}
//                                 to={item.path}
//                                 className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition ${isActive
//                                         ? "bg-blue-50 text-blue-600"
//                                         : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                                     }`}
//                             >
//                                 <span className={isActive ? "text-blue-600" : "text-slate-400"}>
//                                     {item.icon}
//                                 </span>
//                                 <span>{item.name}</span>
//                             </Link>
//                         );
//                     })}
//                 </nav>
//             </div>
//         </aside>
//     );
// };

// export default Sidebar;

import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: "🏠" },
  { label: "Documents", path: "/documents", icon: "📄" },
  { label: "Shared with you", path: "/shared", icon: "🔗" },
  { label: "Favorites", path: "/favorites", icon: "⭐" },
  { label: "Trash", path: "/trash", icon: "🗑️" },
];
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E6E4DD] flex flex-col transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="h-16 flex items-center gap-2 px-5 border-b border-[#E6E4DD]">
          <div className="w-7 h-7 rounded-md bg-[#3D5AFE] flex items-center justify-center text-white text-sm font-semibold">
            V
          </div>
          <span className="text-sm font-semibold text-[#12141C]">Docs</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${active
                  ? "bg-[#EEF1FF] text-[#3D5AFE]"
                  : "text-[#4B5563] hover:bg-[#F1EFE8]"
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#E6E4DD]">
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#4B5563] hover:bg-[#F1EFE8] transition"
          >
            <span className="text-base">⚙️</span>
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;