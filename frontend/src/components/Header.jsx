// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Header = ({ search = "", setSearch = () => { }, username = "admin" }) => {
//   const navigate = useNavigate();

//   const avatarLetter = username.trim().charAt(0).toUpperCase();

//   return (
//     <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
//       <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-full max-w-xl">
//         <input
//           type="text"
//           placeholder="Search documents..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="bg-transparent w-full h-10 outline-none"
//         />
//       </div>

//       <div className="flex items-center gap-4">
//         <button>🔔</button>
//         <button>❓</button>

//         <div className="w-px h-8 bg-gray-300" />

//         <button
//           onClick={() => navigate("/profile")}
//           className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer"
//         >
//           {avatarLetter}
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;
import { useState, useEffect } from "react";
import api from "../api/api";

function Header({
  onMenuClick,
  search = "",
  setSearch = () => { },
}) {

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const res = await api.get("user/");
        setCurrentUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadCurrentUser();
  }, []);

  return (
    <header className="h-16 flex items-center justify-between gap-4 px-4 lg:px-8 border-b border-[#E6E4DD] bg-white sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1EFE8] transition shrink-0"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="#12141C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative hidden sm:block w-full max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width="15" height="15" viewBox="0 0 15 15" fill="none"
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="#9CA3AF" strokeWidth="1.4" />
            <path d="M10.5 10.5L13 13" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#E6E4DD] bg-[#FAFAF7] text-[#12141C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3D5AFE]/30 focus:border-[#3D5AFE]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1EFE8] transition relative"
          aria-label="Notifications"
        >
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path
              d="M8.5 2a4 4 0 0 0-4 4v2.2c0 .5-.18.98-.5 1.36L3 10.8c-.5.6-.08 1.5.7 1.5h9.6c.78 0 1.2-.9.7-1.5l-1-1.24a2.1 2.1 0 0 1-.5-1.36V6a4 4 0 0 0-4-4Z"
              stroke="#4B5563" strokeWidth="1.3" strokeLinejoin="round"
            />
            <path d="M6.8 14a1.8 1.8 0 0 0 3.4 0" stroke="#4B5563" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3D5AFE]" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-[#E6E4DD]">
          <div className="w-8 h-8 rounded-full bg-[#3D5AFE] flex items-center justify-center text-white text-xs font-semibold">
            {currentUser?.username?.charAt(0).toUpperCase() || "U"}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;