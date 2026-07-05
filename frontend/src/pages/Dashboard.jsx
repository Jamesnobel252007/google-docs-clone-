import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/api';

import Sidebar from '../components/Sidebar';
import Header from "../components/Header";

function Dashboard() {

  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

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
    const loadDocuments = async () => {
      try {
        const response = await api.get("documents/");
        setDocuments(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDocuments();
  }, []);

  const createDocument = async () => {
  try {
    const response = await api.post("documents/", {
      title: "Untitled Document",
      content: "<p></p>",
    });

    await fetchDocuments();
    navigate(`/editor/${response.data.id}`);
  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
  }
};

  const deleteDocument = async (e, id) => {
    e.stopPropagation();

    const confirmDelete = window.confirm("Delete this document?");

    if (!confirmDelete) return;

    try {
      await api.delete(`documents/${id}/`);

      // Reload documents from backend
      fetchDocuments();

    } catch (error) {
      console.error(error.response?.data || error);
      alert("Failed to delete document.");
    }
  };

  const renameDocument = async (id, newTitle) => {
    try {
      await api.patch(`documents/${id}/`, {
        title: newTitle,
      });

      fetchDocuments();
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };


  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );


  return (

    <div className="flex min-h-screen bg-[#F9FBFD]">
      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Header
          search={search}
          setSearch={setSearch}
        />



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
                  {editingId === doc.id ? (
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => {
                        renameDocument(doc.id, editingTitle);
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          renameDocument(doc.id, editingTitle);
                          setEditingId(null);
                        }
                      }}
                      className="font-bold text-base border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <h3
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingId(doc.id);
                        setEditingTitle(doc.title);
                      }}
                      className="font-bold text-slate-900 text-base group-hover:text-blue-600 line-clamp-1 transition-colors"
                    >
                      {doc.title}
                    </h3>
                  )}
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Updated {new Date(doc.updated_at).toLocaleString()}
                    </span>
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

  )
}

export default Dashboard;