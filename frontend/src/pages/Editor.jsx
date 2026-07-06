import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TiptapEditor from "../components/TiptapEditor";
import api from "../api/api";

const WS_BASE = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000";

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewDoc = id === "new";

  const [sharing, setSharing] = useState(false);
  const [title, setTitle] = useState("Untitled Document");
  const [status, setStatus] = useState("Saved");
  const [content, setContent] = useState("<p></p>");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState("viewer");
  const socketRef = useRef(null);
  const isRemote = useRef(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [loadingDoc, setLoadingDoc] = useState(true);
  const [loadError, setLoadError] = useState("");

  const isOwner = collaborators?.some(
    (c) => c.id === currentUser?.id && c.role === "owner"
  );

  const loadCollaborators = useCallback(async () => {
    if (!id || isNewDoc) return;

    try {
      const res = await api.get(`documents/${id}/collaborators/`);
      setCollaborators(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id, isNewDoc]);

  // Create a fresh document when arriving via /editor/new, then swap the
  // URL to the real id so refresh, sharing, and the WebSocket all work.
  useEffect(() => {
    const createNewDocument = async () => {
      try {
        setLoadingDoc(true);
        const { data } = await api.post("documents/", {
          title: "Untitled Document",
          content: "<p></p>",
        });
        navigate(`/editor/${data.id}`, { replace: true });
      } catch (err) {
        console.error(err);
        setLoadError("Couldn't create a new document. Try again.");
        setLoadingDoc(false);
      }
    };

    if (isNewDoc) createNewDocument();
  }, [isNewDoc, navigate]);

  useEffect(() => {
    const loadDocument = async () => {
      if (!id || isNewDoc) return;

      try {
        setLoadingDoc(true);
        setLoadError("");
        const { data } = await api.get(`documents/${id}/`);
        setTitle(data.title);
        setContent(data.content);
        await loadCollaborators();
      } catch (err) {
        console.error(err);
        setLoadError("Couldn't load this document. It may have been removed, or you may not have access.");
      } finally {
        setLoadingDoc(false);
      }
    };

    loadDocument();
  }, [id, isNewDoc, loadCollaborators]);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowShareModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!id || isNewDoc) return;

    const token = localStorage.getItem("access");
    if (!token) return;

    const socket = new WebSocket(
      `${WS_BASE}/ws/documents/${id}/?token=${token}`
    );

    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "online_users") {
        setOnlineUsers(data.users);
        return;
      }

      if (data.type === "content") {
        isRemote.current = true;
        setContent(data.message);
      }
    };

    socket.onerror = (e) => {
      console.error("WS error", e);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [id, isNewDoc]);

  const shareDocument = async () => {
    if (!shareEmail.trim()) return;

    setSharing(true);

    try {
      await api.post("share/", {
        document_id: id,
        email: shareEmail,
        role: shareRole,
      });
      await loadCollaborators();
      setShowShareModal(false);
      setShareEmail("");
      setShareRole("viewer");
    } catch (err) {
      alert(err.response?.data?.error || "Unable to share");
    } finally {
      setSharing(false);
    }
  };

  const saveDocument = async () => {
    try {
      setStatus("Saving...");
      await api.patch(`documents/${id}/`, {
        title,
        content,
      });
      setStatus("Saved");
    } catch (err) {
      console.error(err);
      setStatus("Couldn't save");
    }
  };

  const exportDocument = (type) => {
    switch (type) {
      case "html":
        alert("HTML export coming soon.");
        break;
      case "csv":
        alert("CSV export coming soon.");
        break;
      case "excel":
        alert("Excel export coming soon.");
        break;
      default:
        break;
    }
  };

  const removeCollaborator = async (userId) => {
    if (!window.confirm("Remove this collaborator from this document?")) {
      return;
    }
    try {
      await api.delete(`documents/${id}/remove-collaborator/${userId}/`);
      setCollaborators((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      alert(err.response?.data?.error || "Unable to remove collaborator");
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await api.patch(`collaborators/${userId}/`, { role });
      loadCollaborators();
    } catch (err) {
      console.error(err);
      alert("Unable to update role");
    }
  };

  if (loadingDoc) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center">
        <p className="text-slate-400 text-sm">
          {isNewDoc ? "Creating your document..." : "Loading document..."}
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md text-center shadow-sm">
          <p className="text-slate-800 font-semibold mb-2">Something went wrong</p>
          <p className="text-sm text-slate-500 mb-5">{loadError}</p>
          <button
            onClick={() => navigate("/documents")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Back to documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition"
          >
            ←
          </button>

          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
            📄
          </div>

          <div>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setStatus("Unsaved changes");
              }}
              className="text-2xl font-bold bg-transparent outline-none border-none text-slate-800"
            />

            <p
              className={`text-xs mt-1 font-medium ${
                status === "Saved" ? "text-emerald-500" : "text-orange-500"
              }`}
            >
              {status}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            disabled={sharing}
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            {sharing ? "Sharing..." : "Share"}
          </button>

          <button
            onClick={saveDocument}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
          >
            Save
          </button>

          <select
            defaultValue=""
            onChange={(e) => {
              exportDocument(e.target.value);
              e.target.value = "";
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none hover:bg-slate-50"
          >
            <option value="" disabled>
              Export
            </option>
            <option value="html">HTML</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow">
            {currentUser?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </header>

      {/* Editor Body */}
      <main className="px-6 py-8">
        <div className="max-w-[1600px] mx-auto flex gap-8 items-start">
          {/* ================= Editor ================= */}
          <section className="flex-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg min-h-[85vh] p-10">
              <TiptapEditor
                content={content}
                setContent={setContent}
                setStatus={setStatus}
                socketRef={socketRef}
                isRemote={isRemote}
              />
            </div>
          </section>

          {/* ================= Sidebar ================= */}
          <aside className="w-[340px] sticky top-24 space-y-6">
            {/* ONLINE USERS */}
            <div className="bg-white rounded-2xl border shadow p-6">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                🟢 Online Users
              </h3>

              {onlineUsers.length === 0 ? (
                <p className="text-gray-400 text-sm">Nobody online</p>
              ) : (
                onlineUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 py-3 border-b last:border-none"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">{user}</span>
                  </div>
                ))
              )}
            </div>

            {/* COLLABORATORS */}
            <div className="bg-white rounded-2xl border shadow p-6">
              <h3 className="font-bold text-lg mb-5">👥 Collaborators</h3>

              <div className="max-h-[500px] overflow-y-auto">
                {collaborators.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center py-4 border-b last:border-none"
                  >
                    <div>
                      <div className="font-semibold">
                        {user.username}
                        {user.role === "owner" && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            Owner
                          </span>
                        )}
                      </div>

                      {user.role !== "owner" && (
                        <div className="text-xs text-gray-500 capitalize">
                          {user.role}
                        </div>
                      )}
                    </div>

                    {isOwner && user.role !== "owner" ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          className="border rounded-md px-2 py-1 text-sm"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                        </select>

                        <button
                          onClick={() => removeCollaborator(user.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-xl w-[420px] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-slate-800">Share Document</h2>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Invite collaborators to edit or view this document.
            </p>

            <input
              type="email"
              placeholder="Enter collaborator email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              value={shareRole}
              onChange={(e) => setShareRole(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-6"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={shareDocument}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Editor;
