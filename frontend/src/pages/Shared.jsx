import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const Shared = () => {
    return (
        <div
            className="min-h-screen bg-[#F9FBFD] text-slate-800 flex font-sans selection:bg-blue-100"
            onClick={() => {
                setOpenMenuId(null);
                setSortMenuOpen(false);
            }}
        >
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header
                    search={search}
                    setSearch={setSearch}
                />
                <div className="flex-1 flex flex-col">






                </div>
            </div>
        </div>
    )
}

export default Shared
