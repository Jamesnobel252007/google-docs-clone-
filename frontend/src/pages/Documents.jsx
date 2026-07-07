import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../api/api";

async function fetchDocuments(mode) {
  let url = "documents/";

  if (mode === "favorites") {
    url += "?filter=favorites";
  } else if (mode === "trash") {
    url += "?filter=trash";
  }

  const response = await api.get(url);

  return response.data.map((doc) => ({
    id: doc.id,
    title: doc.title,
    updatedAt: doc.updated_at,
    isFavorite: doc.is_favorite,
    isTrashed: doc.is_trashed,
  }));
}

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function Documents() {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.pathname.includes("/favorites")
    ? "favorites"
    : location.pathname.includes("/trash")
    ? "trash"
    : "all";

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [view, setView] = useState("grid");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    setLoading(true);

    fetchDocuments(mode)
      .then(setDocs)
      .catch((err) => {
        console.error(err);
        setError("Failed to load documents.");
      })
      .finally(() => setLoading(false));
  }, [mode]);

  const filteredDocs = useMemo(() => {
    let result = docs.filter((d) =>
      mode === "trash" ? d.isTrashed : mode === "favorites" ? d.isFavorite && !d.isTrashed : !d.isTrashed
    );

    if (search.trim()) {
      result = result.filter((d) =>
        d.title.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      const diff = new Date(b.updatedAt) - new Date(a.updatedAt);
      return sortOrder === "newest" ? diff : -diff;
    });

    return result;
  }, [docs, mode, search, sortOrder]);

  const updateDoc = async (id, changes) => {
    try {
      await api.patch(`documents/${id}/`, changes);
      setDocs((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...changes } : doc)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteForever = async (id) => {
    try {
      await api.delete(`documents/${id}/delete_forever/`);
      setDocs((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (doc) => {
    try {
      const res = await api.patch(`documents/${doc.id}/favorite/`);
      setDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, isFavorite: res.data.is_favorite } : d))
      );
      setOpenMenuId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const moveToTrash = async (doc) => {
    try {
      await api.patch(`documents/${doc.id}/trash/`);
      setDocs((prev) => prev.map((d) => (d.id === doc.id ? { ...d, isTrashed: true } : d)));
      setOpenMenuId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const restoreDoc = async (doc) => {
    try {
      await api.patch(`documents/${doc.id}/restore/`);
      setDocs((prev) => prev.map((d) => (d.id === doc.id ? { ...d, isTrashed: false } : d)));
      setOpenMenuId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const startRename = (doc) => {
    setRenamingId(doc.id);
    setRenameValue(doc.title);
    setOpenMenuId(null);
  };

  const commitRename = async (doc) => {
    const trimmed = renameValue.trim();

    if (!trimmed) {
      setRenamingId(null);
      return;
    }

    try {
      await api.patch(`documents/${doc.id}/`, { title: trimmed });
      setDocs((prev) => prev.map((d) => (d.id === doc.id ? { ...d, title: trimmed } : d)));
      setRenamingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const pageTitle =
    mode === "favorites" ? "Favorites" : mode === "trash" ? "Trash" : "Documents";

  const pageSubtitle =
    mode === "favorites"
      ? "Documents you've starred."
      : mode === "trash"
      ? "Items here are removed after 30 days."
      : "All your documents in one place.";

  return (
    <div className="flex min-h-screen bg-[#FAFAF7]">
      {/* Fixed left navigation */}
      <Sidebar />

      {/* Right side: header on top, page content below */}
      <div className="flex-1 flex flex-col min-w-0">
       <Header
    search={search}
    setSearch={setSearch}
/>

        <main className="flex-1 p-8 max-w-6xl w-full">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-[#12141C] mb-1">{pageTitle}</h1>
              <p className="text-sm text-[#6B7280]">{pageSubtitle}</p>
            </div>
            {mode === "all" && (
              <button
                onClick={() => navigate("/editor/new")}
                className="px-4 py-2.5 rounded-lg bg-[#3D5AFE] text-white text-sm font-medium hover:bg-[#2F46D6] active:scale-[0.98] transition"
              >
                + New document
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-[#F1EFE8] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-[#FEF3F2] border border-[#FDA29B] text-[#B42318] text-sm rounded-lg px-4 py-3 max-w-md">
              {error}
            </div>
          ) : (
            <>
              {/* Toolbar — this is the ONLY search box for documents.
                  If Header.jsx also renders a search input, remove it there,
                  or wire it to call setSearch from a shared context/store. */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents..."
                  className="flex-1 min-w-[200px] px-3.5 py-2 rounded-lg border border-[#E6E4DD] bg-white text-sm text-[#12141C] placeholder:text-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#3D5AFE]/25 focus:border-[#3D5AFE] transition"
                />

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#E6E4DD] bg-white text-sm text-[#12141C] outline-none focus:ring-2 focus:ring-[#3D5AFE]/25"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>

                <div className="flex border border-[#E6E4DD] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={`px-3 py-2 text-sm ${
                      view === "grid" ? "bg-[#EEF1FF] text-[#3D5AFE]" : "bg-white text-[#6B7280]"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`px-3 py-2 text-sm border-l border-[#E6E4DD] ${
                      view === "list" ? "bg-[#EEF1FF] text-[#3D5AFE]" : "bg-white text-[#6B7280]"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>

              {/* Empty state */}
              {filteredDocs.length === 0 && (
                <div className="border border-dashed border-[#E6E4DD] rounded-xl p-12 text-center">
                  <p className="text-sm font-medium text-[#12141C] mb-1">
                    {search
                      ? "No documents match your search."
                      : mode === "trash"
                      ? "Trash is empty."
                      : mode === "favorites"
                      ? "No favorites yet."
                      : "No documents yet."}
                  </p>
                  {mode === "all" && !search && (
                    <button
                      onClick={() => navigate("/editor/new")}
                      className="text-sm text-[#3D5AFE] font-medium hover:underline"
                    >
                      Create your first document
                    </button>
                  )}
                </div>
              )}

              {/* Grid view */}
              {filteredDocs.length > 0 && view === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="relative bg-white border border-[#E6E4DD] rounded-xl p-4 hover:border-[#3D5AFE]/40 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-8 h-8 rounded-md bg-[#EEF1FF] flex items-center justify-center text-sm">
                          📄
                        </div>
                        <div className="flex items-center gap-1">
                          {doc.isFavorite && <span className="text-[#F5A524] text-sm">★</span>}
                          <button
                            onClick={() => setOpenMenuId(openMenuId === doc.id ? null : doc.id)}
                            className="text-[#9CA3AF] hover:text-[#12141C] px-1"
                            aria-label="Document actions"
                          >
                            ⋯
                          </button>
                        </div>
                      </div>

                      {renamingId === doc.id ? (
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => commitRename(doc)}
                          onKeyDown={(e) => e.key === "Enter" && commitRename(doc)}
                          className="w-full text-sm font-medium text-[#12141C] border border-[#3D5AFE] rounded px-1.5 py-0.5 mb-1 outline-none"
                        />
                      ) : (
                        <button
                          onClick={() => navigate(`/editor/${doc.id}`)}
                          className="text-left w-full text-sm font-medium text-[#12141C] mb-1 truncate hover:text-[#3D5AFE]"
                        >
                          {doc.title}
                        </button>
                      )}
                      <p className="text-xs text-[#9CA3AF]">{timeAgo(doc.updatedAt)}</p>

                      {openMenuId === doc.id && (
                        <div className="absolute right-3 top-12 z-10 bg-white border border-[#E6E4DD] rounded-lg shadow-md py-1 w-40 text-sm">
                          {mode === "trash" ? (
                            <>
                              <button
                                onClick={() => restoreDoc(doc)}
                                className="w-full text-left px-3 py-2 hover:bg-[#F5F4F0] text-[#12141C]"
                              >
                                Restore
                              </button>
                              <button
                                onClick={() => deleteForever(doc.id)}
                                className="w-full text-left px-3 py-2 hover:bg-[#FEF3F2] text-[#B42318]"
                              >
                                Delete forever
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => navigate(`/editor/${doc.id}`)}
                                className="w-full text-left px-3 py-2 hover:bg-[#F5F4F0] text-[#12141C]"
                              >
                                Open
                              </button>
                              <button
                                onClick={() => startRename(doc)}
                                className="w-full text-left px-3 py-2 hover:bg-[#F5F4F0] text-[#12141C]"
                              >
                                Rename
                              </button>
                              <button
                                onClick={() => toggleFavorite(doc)}
                                className="w-full text-left px-3 py-2 hover:bg-[#F5F4F0] text-[#12141C]"
                              >
                                {doc.isFavorite ? "Remove from favorites" : "Add to favorites"}
                              </button>
                              <button
                                onClick={() => moveToTrash(doc)}
                                className="w-full text-left px-3 py-2 hover:bg-[#FEF3F2] text-[#B42318]"
                              >
                                Move to trash
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* List view */}
              {filteredDocs.length > 0 && view === "list" && (
                <div className="border border-[#E6E4DD] rounded-xl overflow-hidden">
                  {filteredDocs.map((doc, i) => (
                    <div
                      key={doc.id}
                      className={`relative flex items-center justify-between px-4 py-3 bg-white hover:bg-[#FAFAF7] transition ${
                        i !== 0 ? "border-t border-[#E6E4DD]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-sm">📄</span>
                        {renamingId === doc.id ? (
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => commitRename(doc)}
                            onKeyDown={(e) => e.key === "Enter" && commitRename(doc)}
                            className="text-sm font-medium text-[#12141C] border border-[#3D5AFE] rounded px-1.5 py-0.5 outline-none"
                          />
                        ) : (
                          <button
                            onClick={() => navigate(`/editor/${doc.id}`)}
                            className="text-sm font-medium text-[#12141C] truncate hover:text-[#3D5AFE]"
                          >
                            {doc.title}
                          </button>
                        )}
                        {doc.isFavorite && <span className="text-[#F5A524] text-xs">★</span>}
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-[#9CA3AF]">{timeAgo(doc.updatedAt)}</span>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === doc.id ? null : doc.id)}
                          className="text-[#9CA3AF] hover:text-[#12141C] px-1"
                          aria-label="Document actions"
                        >
                          ⋯
                        </button>
                      </div>

                      {openMenuId === doc.id && (
                        <div className="absolute right-4 top-12 z-10 bg-white border border-[#E6E4DD] rounded-lg shadow-md py-1 w-40 text-sm">
                          {mode === "trash" ? (
                            <>
                              <button
                                onClick={() => restoreDoc(doc)}
                                className="w-full text-left px-3 py-2 hover:bg-[#F5F4F0] text-[#12141C]"
                              >
                                Restore
                              </button>
                              <button
                                onClick={() => deleteForever(doc.id)}
                                className="w-full text-left px-3 py-2 hover:bg-[#FEF3F2] text-[#B42318]"
                              >
                                Delete forever
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => navigate(`/editor/${doc.id}`)}
                                className="w-full text-left px-3 py-2 hover:bg-[#F5F4F0] text-[#12141C]"
                              >
                                Open
                              </button>
                              <button
                                onClick={() => startRename(doc)}
                                className="w-full text-left px-3 py-2 hover:bg-[#F5F4F0] text-[#12141C]"
                              >
                                Rename
                              </button>
                              <button
                                onClick={() => toggleFavorite(doc)}
                                className="w-full text-left px-3 py-2 hover:bg-[#F5F4F0] text-[#12141C]"
                              >
                                {doc.isFavorite ? "Remove from favorites" : "Add to favorites"}
                              </button>
                              <button
                                onClick={() => moveToTrash(doc)}
                                className="w-full text-left px-3 py-2 hover:bg-[#FEF3F2] text-[#B42318]"
                              >
                                Move to trash
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
