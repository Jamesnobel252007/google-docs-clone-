import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  Share2,
  Star,
  Trash2,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Plus,
  MoreHorizontal,
  Grid3x3,
  List,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

function Documents() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedDocuments =
      JSON.parse(localStorage.getItem("documents-list")) || [];
    setDocuments(savedDocuments);
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
    setOpenMenuId(null);

    const confirmDelete = window.confirm("Delete this document?");
    if (confirmDelete) {
      const updatedDocs = documents.filter((doc) => doc.id !== id);
      updateDocuments(updatedDocs);
      localStorage.removeItem(`doc-${id}`);
    }
  };

  // id is a Date.now() timestamp, so it doubles as a reliable sort key
  const filteredAndSortedDocuments = useMemo(() => {
    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );
    return [...filtered].sort((a, b) =>
      sortOrder === "newest" ? b.id - a.id : a.id - b.id
    );
  }, [documents, search, sortOrder]);

  const navItems = [
    { label: "Dashboard", icon: LayoutGrid, active: false },
    { label: "Documents", icon: FileText, active: true },
    { label: "Shared", icon: Share2, active: false },
    { label: "Favorites", icon: Star, active: false },
  ];

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
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between fixed h-screen z-30">
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8 px-1">
            <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center text-white font-black shadow-md shadow-blue-200/50 text-xs tracking-wider">
              VD
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-slate-900 tracking-tight text-base">
                VDocs
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                Workspace
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col space-y-1">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                onClick={() =>
                  label === "Dashboard" ? navigate("/dashboard") : null
                }
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 font-medium"
                }`}
              >
                <Icon size={17} strokeWidth={2.25} />
                <span>{label}</span>
              </button>
            ))}

            <div className="h-px bg-slate-100 my-4" />

            <button className="w-full flex items-center space-x-3 px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition">
              <Trash2 size={17} strokeWidth={2.25} />
              <span>Trash</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition">
              <Settings size={17} strokeWidth={2.25} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Storage Usage */}
        <div className="p-4 m-4 bg-[#EDF3FC] border border-blue-100 rounded-2xl">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Storage Usage
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: "65%" }}
            />
          </div>
          <div className="text-xs font-bold text-blue-700">
            6.5 GB of 10 GB used
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col pl-64">
        {/* Top nav */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm shadow-slate-100/40">
          <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 w-full max-w-xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
            <Search size={16} className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 w-full focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-3 ml-6">
            <button className="text-slate-500 hover:bg-slate-50 p-2 rounded-xl transition relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-blue-600 rounded-full" />
            </button>
            <button className="text-slate-500 hover:bg-slate-50 p-2 rounded-xl transition">
              <HelpCircle size={18} />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm shadow-blue-500/20">
              Share
            </button>
            <div className="h-9 w-9 rounded-xl bg-blue-600 border-2 border-white shadow-md text-white font-bold flex items-center justify-center text-sm">
              S
            </div>
          </div>
        </header>

        {/* Documents body */}
        <main className="p-8 max-w-7xl w-full mx-auto relative flex-1 pb-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                All Documents
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {filteredAndSortedDocuments.length}{" "}
                {filteredAndSortedDocuments.length === 1
                  ? "document"
                  : "documents"}{" "}
                in your workspace
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Sort control */}
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

              {/* Grid / list toggle */}
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

          {/* List view header row */}
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
                onClick={() => navigate(`/editor/${doc.id}`)}
                className={`bg-white border border-slate-200/80 rounded-[20px] p-6 flex ${
                  viewMode === "grid"
                    ? "flex-col justify-between min-h-[190px]"
                    : "flex-row items-center justify-between"
                } shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-200 relative group cursor-pointer`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                      <FileText size={19} strokeWidth={2.25} />
                    </div>

                    {viewMode === "list" && (
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {doc.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[11px] text-slate-400 font-medium">
                            Updated {doc.date}
                          </span>
                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded-md border border-slate-200/60">
                            Owner
                          </span>
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
                        <div className="absolute right-0 top-9 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 py-1.5 w-36 z-10">
                          <button
                            onClick={(e) => deleteDocument(e, doc.id)}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {viewMode === "grid" && (
                  <div className="mt-4">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 line-clamp-1 transition-colors">
                      {doc.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          Updated {doc.date}
                        </span>
                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                        <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded-md border border-slate-200/60">
                          Owner
                        </span>
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

          {/* Empty states */}
          {filteredAndSortedDocuments.length === 0 && documents.length > 0 && (
            <div className="text-center py-16 bg-white border border-slate-200/60 rounded-2xl mt-4">
              <Search size={28} className="mx-auto mb-2 text-slate-300" />
              <h3 className="font-bold text-slate-700 text-base">
                No matching documents
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your workspace lookup filters
              </p>
            </div>
          )}

          {documents.length === 0 && (
            <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl mt-4">
              <FileText size={28} className="mx-auto mb-3 text-slate-300" />
              <h3 className="font-bold text-slate-700 text-base">
                No documents yet
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Create your first document to get started
              </p>
              <button
                onClick={createDocument}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                <Plus size={14} strokeWidth={2.5} />
                New Document
              </button>
            </div>
          )}
        </main>

        {/* Floating action button */}
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
      </div>
    </div>
  );
}

export default Documents;