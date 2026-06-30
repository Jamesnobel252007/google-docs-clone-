import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/api';
import { Link } from "react-router-dom";

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false); // Can be used for mobile toggle
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);

  const navigate = useNavigate();

const fetchDocuments = async () => {
    try {
        const response = await api.get("documents/");

        setDocuments(response.data);

        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

 useEffect(() => {
    fetchDocuments();
}, []);

  const updateDocuments = (updatedDocs) => {
    setDocuments(updatedDocs);
    localStorage.setItem("documents-list", JSON.stringify(updatedDocs));
  };

  const createDocument = () => {
    const newDoc = {
      id: Date.now(),
      title: "Untitled Document",
      date: "Today",
    };

    const updatedDocs = [newDoc, ...documents];
    updateDocuments(updatedDocs);

    localStorage.setItem(
      `doc-${newDoc.id}`,
      JSON.stringify({
        id: newDoc.id,
        title: newDoc.title,
        content: "<p></p>",
        updatedAt: new Date().toLocaleString(),
      })
    );

    navigate(`/editor/${newDoc.id}`);
  };

  const deleteDocument = (e, id) => {
    e.stopPropagation();

    const confirmDelete = window.confirm("Delete this document?");
    if (confirmDelete) {
      const updatedDocs = documents.filter((doc) => doc.id !== id);
      updateDocuments(updatedDocs);
      localStorage.removeItem(`doc-${id}`);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FBFD] text-slate-800 flex font-sans selection:bg-blue-100">
      
      {/* 1. Permanent Structural Left Sidebar (Matches Image) */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen ">
        <div className="p-6">
          {/* VDocs Branding Accent */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-14 w-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center text-white font-black shadow-md shadow-blue-200/50 text-sm tracking-wider">
              VD
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 tracking-tight text-lg leading-none">VDocs</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-10">Workspace</span>
            </div>
          </div>

          {/* Nav Links Stack */}
          <nav className="flex flex-col space-y-5">
            <button className="w-full my-10 flex items-center space-x-13 px-14 py-13 text-xl font-semibold rounded-xl bg-blue-50 text-blue-600 transition">
              <span className="text-base"></span>
              <span><Link to="/dashboard">Dashboard</Link></span>
            </button>
            <button className="w-full flex items-center space-x-13 px-14 py-13 text-xl  font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition">
              <span className="text-base"></span>
              <span><Link to="/documents">Documents</Link></span>
            </button>
            <button className="w-full flex items-center space-x-13 px-14 py-13 text-xl  font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition">
              <span className="text-base"></span>
              <span><Link to="/shared">Shared</Link></span>
            </button>
            <button className="w-full flex items-center space-x-13 px-14 py-13 text-xl  font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition">
              <span className="text-base"></span>
              <span><Link to="/favorites">Favorites</Link></span>
            </button>
            <div className="h-px bg-slate-100 my-40"></div>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition">
              <span className="text-base">🗑️</span>
              <span><Link to="/trash">Trash</Link></span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition">
              <span className="text-base">⚙️</span>
              <span><Link to="/settings">Settings</Link></span>
            </button>
          </nav>
        </div>

      </aside>

      {/* Main Framework Content Dynamic Layer */}
      <div className="flex-1 flex flex-col pl-64">
        
        {/* 2. Top Navigation Bar Widget */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm shadow-slate-100/40">
          {/* Unified Global Dynamic Search System */}
          <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-xl px-14 py-2  w-full max-w-xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
      
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 w-full h-12 focus:outline-none"
            />
          </div>

          {/* Quick Info User Settings Group */}
          <div className="flex items-center space-x-4">
            <button className="text-slate-500 hover:bg-slate-50 p-2 rounded-xl transition text-lg relative">🔔</button>
            <button className="text-slate-500 hover:bg-slate-50 p-2 rounded-xl transition text-lg">❓</button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="h-9 w-9 rounded-xl bg-blue-600 border-2 border-white shadow-md text-white font-bold flex items-center justify-center text-sm">
              S
            </div>
          </div>
        </header>

        {/* 3. Primary Dashboard Stream Grid Area */}
        <main className="p-8 max-w-7xl w-full mx-auto relative flex-1 pb-24">
          
          {/* Main Workspace Intro Titles */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage and organize your recent documents</p>
            </div>
            {/* Display controls matching design screenshot */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button className="p-2 bg-white text-slate-700 shadow-sm rounded-lg text-xs">🎛️ Grid</button>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg text-xs">📋 List</button>
            </div>
          </div>

          {/* Dynamic Grid Layout showing Documents */}
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Blank Document Initialization Blueprint Card */}
            <div 
              onClick={createDocument}
              className="bg-white border border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col justify-center items-center min-h-[190px] cursor-pointer group transition-all duration-200 hover:shadow-xl hover:shadow-slate-200/50 active:scale-[0.99]"
            >
              <div className="h-12 w-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl font-semibold transition">
                +
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Create Blank Document</h3>
                <p className="text-xs text-slate-400">Initialize a new clean multi-user canvas</p>
              </div>
            </div>

            {/* Rendered State Elements Stack */}
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/editor/${doc.id}`)}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-center items-center min-h-[190px] shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-200 relative group cursor-pointer"
              >
                {/* Header item detail layout */}
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-base">
                    📄
                  </div>
                  {/* Absolute positioning inline for safety trigger delete action */}
                  <button
                    onClick={(e) => deleteDocument(e, doc.id)}
                    className="opacity-0 group-hover:opacity-100 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs px-2.5 py-1.5 rounded-lg transition-all absolute top-4 right-4"
                  >
                    Delete
                  </button>
                </div>

                {/* Information content container layout */}
                <div className="mt-4">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 line-clamp-1 transition-colors">
                    {doc.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Updated {doc.date}</span>
                    <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded-md border border-slate-200/60">Owner</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conditional Empty Search Overlay Layout */}
          {filteredDocuments.length === 0 && documents.length > 0 && (
            <div className="text-center py-16 bg-white border border-slate-200/60 rounded-2xl mt-4">
             
              <h3 className="font-bold text-slate-700 text-base">No matching documents</h3>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your workspace lookup filters</p>
            </div>
          )}
        </main>

        {/* 4. Floating Action Execution Command Button Trigger (Matches Image positioning) */}
        <button 
          onClick={createDocument}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl w-42 h-12 rounded-full shadow-lg shadow-blue-500/30 flex justify-center items-center space-x-2 transition-all active:scale-[0.98] z-40 group"
        >
          <span className="text-base group-hover:rotate-90 transition-transform duration-200">+</span>
          <span>New Document</span>
        </button>

      </div>
    </div>
  );
}

export default Dashboard;