import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../api/api";
import {
  FileText,
  Trash2,
  Search,
  Plus,
  MoreHorizontal,
  Grid3x3,
  List,
  ArrowUpDown,
  ChevronDown,
  Star,
  RotateCcw,
} from "lucide-react";
import Header from "../components/Header";

function Documents() {
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const pageType =
    location.pathname === "/favorites"
      ? "favorites"
      : location.pathname === "/trash"
      ? "trash"
      : "documents";

  const pageTitle =
    pageType === "favorites"
      ? "Favorite Documents"
      : pageType === "trash"
      ? "Trash"
      : "All Documents";

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("documents/");

      const preparedDocs = data.map((doc) => ({
        ...doc,
        is_favorite: doc.is_favorite || false,
        is_trashed: doc.is_trashed || false,
      }));

      setDocuments(preparedDocs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const createDocument = async () => {
    try {
      const response = await api.post("documents/", {
        title: "Untitled Document",
        content: "<p></p>",
      });

      fetchDocuments();
      navigate(`/editor/${response.data.id}`);
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(null);

    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id ? { ...doc, is_favorite: !doc.is_favorite } : doc
      )
    );
  };

  const moveToTrash = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(null);

    if (!window.confirm("Move this document to trash?")) return;

    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id ? { ...doc, is_trashed: true } : doc
      )
    );
  };

  const restoreDocument = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(null);

    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id ? { ...doc, is_trashed: false } : doc
      )
    );
  };

  const deleteForever = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(null);

    if (!window.confirm("Delete forever? This cannot be undone.")) return;

    setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
  };

  const renameDocument = async (id, title) => {
    try {
      await api.patch(`documents/${id}/`, { title });
      fetchDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents;

    if (pageType === "documents") {
      filtered = filtered.filter((doc) => !doc.is_trashed);
    }

    if (pageType === "favorites") {
      filtered = filtered.filter((doc) => doc.is_favorite && !doc.is_trashed);
    }

    if (pageType === "trash") {
      filtered = filtered.filter((doc) => doc.is_trashed);
    }

    filtered = filtered.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.updated_at) - new Date(a.updated_at);
      }

      return new Date(a.updated_at) - new Date(b.updated_at);
    });
  }, [documents, search, sortOrder, pageType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const collaboratorColors = ["bg-rose-400", "bg-amber-400", "bg-emerald-400"];
  const sortLabel = sortOrder === "newest" ? "Newest first" : "Oldest first";

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
        <Header search={search} setSearch={setSearch} />

        <div className="flex-1 flex flex-col">
          <main className="p-8 max-w-7xl w-full mx-auto relative flex-1 pb-24">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {pageTitle}
                </h1>

                <p className="text-sm text-slate-500 mt-0.5">
                  {filteredAndSortedDocuments.length}{" "}
                  {filteredAndSortedDocuments.length === 1
                    ? "document"
                    : "documents"}{" "}
                  in this section
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSortMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
                  >
                    <ArrowUpDown size={14} />
                    {sortLabel}
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {sortMenuOpen && (
                    <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 py-1.5 w-40 z-10">
                      <button
                        onClick={() => {
                          setSortOrder("newest");
                          setSortMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition ${
                          sortOrder === "newest"
                            ? "text-blue-600 bg-blue-50"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Newest first
                      </button>

                      <button
                        onClick={() => {
                          setSortOrder("oldest");
                          setSortMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition ${
                          sortOrder === "oldest"
                            ? "text-blue-600 bg-blue-50"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Oldest first
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      viewMode === "grid"
                        ? "bg-white text-slate-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Grid3x3 size={14} /> Grid
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      viewMode === "list"
                        ? "bg-white text-slate-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <List size={14} /> List
                  </button>
                </div>
              </div>
            </div>

            {viewMode === "list" && filteredAndSortedDocuments.length > 0 && (
              <div className="flex items-center justify-between px-6 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Name</span>
                <span className="pr-10">Updated</span>
              </div>
            )}

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  : "flex flex-col gap-3"
              }
            >
              {filteredAndSortedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    if (!doc.is_trashed) navigate(`/editor/${doc.id}`);
                  }}
                  className={`bg-white border border-slate-200/80 rounded-[20px] p-6 flex ${
                    viewMode === "grid"
                      ? "flex-col justify-between min-h-[190px]"
                      : "flex-row items-center justify-between"
                  } shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-200 relative group ${
                    doc.is_trashed ? "cursor-default opacity-80" : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <FileText size={19} strokeWidth={2.25} />
                      </div>

                      {viewMode === "list" && (
                        <div>
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
                                if (doc.is_trashed) return;
                                e.stopPropagation();
                                setEditingId(doc.id);
                                setEditingTitle(doc.title);
                              }}
                              className="font-bold text-slate-900 text-base hover:text-blue-600 cursor-text"
                            >
                              {doc.title}
                            </h3>
                          )}

                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[11px] text-slate-400 font-medium">
                              Updated {new Date(doc.updated_at).toLocaleString()}
                            </span>

                            {doc.is_favorite && (
                              <span className="text-[10px] bg-yellow-50 text-yellow-600 font-bold px-2 py-0.5 rounded-md border border-yellow-200">
                                Favorite
                              </span>
                            )}

                            {doc.is_trashed && (
                              <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-md border border-red-200">
                                Trashed
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {viewMode === "list" && (
                        <div className="flex -space-x-2 mr-2">
                          {collaboratorColors.map((color, i) => (
                            <div
                              key={i}
                              className={`h-6 w-6 rounded-full ${color} border-2 border-white`}
                            />
                          ))}
                        </div>
                      )}

                      <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === doc.id ? null : doc.id)
                          }
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-1.5 rounded-lg transition-all"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {openMenuId === doc.id && (
                          <div className="absolute right-0 top-9 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 py-1.5 w-44 z-10">
                            {!doc.is_trashed ? (
                              <>
                                <button
                                  onClick={(e) => toggleFavorite(e, doc.id)}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-yellow-600 hover:bg-yellow-50 transition flex items-center gap-2"
                                >
                                  <Star size={13} />
                                  {doc.is_favorite
                                    ? "Remove Favorite"
                                    : "Add Favorite"}
                                </button>

                                <button
                                  onClick={(e) => moveToTrash(e, doc.id)}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                                >
                                  <Trash2 size={13} />
                                  Move to Trash
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => restoreDocument(e, doc.id)}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-green-600 hover:bg-green-50 transition flex items-center gap-2"
                                >
                                  <RotateCcw size={13} />
                                  Restore
                                </button>

                                <button
                                  onClick={(e) => deleteForever(e, doc.id)}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                                >
                                  <Trash2 size={13} />
                                  Delete Forever
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {viewMode === "grid" && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 line-clamp-1 transition-colors">
                          {doc.title}
                        </h3>

                        {doc.is_favorite && (
                          <Star
                            size={15}
                            className="text-yellow-500 fill-yellow-400"
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] text-slate-400 font-medium">
                            Updated {new Date(doc.updated_at).toLocaleString()}
                          </span>

                          <span className="h-1 w-1 bg-slate-300 rounded-full" />

                          {doc.is_trashed ? (
                            <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-md border border-red-200">
                              Trashed
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded-md border border-slate-200/60">
                              Owner
                            </span>
                          )}
                        </div>

                        <div className="flex -space-x-2">
                          {collaboratorColors.map((color, i) => (
                            <div
                              key={i}
                              className={`h-6 w-6 rounded-full ${color} border-2 border-white`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredAndSortedDocuments.length === 0 && documents.length > 0 && (
              <div className="text-center py-16 bg-white border border-slate-200/60 rounded-2xl mt-4">
                <Search size={28} className="mx-auto mb-2 text-slate-300" />
                <h3 className="font-bold text-slate-700 text-base">
                  No documents found
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  This section is empty or no result matches your search.
                </p>
              </div>
            )}

            {documents.length === 0 && (
              <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl mt-4">
                <FileText size={28} className="mx-auto mb-3 text-slate-300" />
                <h3 className="font-bold text-slate-700 text-base">
                  No documents yet
                </h3>
                <p className="text-xl text-slate-400 mt-1 mb-4">
                  Create your first document to get started
                </p>

                <button
                  onClick={createDocument}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold w-45 h-10 px-4 py-2.5 rounded-xl transition"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  New Document
                </button>
              </div>
            )}
          </main>

          {pageType !== "trash" && (
            <button
              onClick={createDocument}
              className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-lg shadow-blue-500/30 flex items-center space-x-2 transition-all active:scale-[0.98] z-40 group"
            >
              <Plus
                size={16}
                strokeWidth={2.5}
                className="group-hover:rotate-90 transition-transform duration-200"
              />
              <span>New Document</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Documents;