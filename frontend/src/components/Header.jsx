import React from "react";

const Header = ({
  search,
  setSearch,
  username = "admin",
}) => {

  const avatarLetter =
    username.trim().charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">

      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-full max-w-xl">

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="bg-transparent w-full h-10 outline-none"
        />

      </div>

      <div className="flex items-center gap-4">

        <button>🔔</button>

        <button>❓</button>

        <div className="w-px h-8 bg-gray-300"/>

        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">

          {avatarLetter}

        </div>

      </div>

    </header>
  );
};

export default Header;