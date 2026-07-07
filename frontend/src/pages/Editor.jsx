import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TiptapEditor from "../components/TiptapEditor";
import api from "../api/api";
import html2pdf from "html2pdf.js";

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
        setLoadError(
          "Couldn't load this document. It may have been removed, or you may not have access."
        );
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
    const safeTitle = (title || "document").replace(/[^a-z0-9\-_ ]/gi, "").trim() || "document";

    if (type === "html") {
      const htmlDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
</head>
<body>
${content}
</body>
</html>`;

      const blob = new Blob([htmlDoc], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeTitle}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    if (type === "pdf") {
      const container = document.createElement("div");
      container.innerHTML = content;
      container.style.padding = "40px";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.color = "#1e293b";
      container.style.lineHeight = "1.7";
      container.style.fontSize = "14px";

      const tableEls = container.querySelectorAll("table");
      tableEls.forEach((t) => {
        t.style.borderCollapse = "collapse";
        t.style.width = "100%";
      });
      const cellEls = container.querySelectorAll("td, th");
      cellEls.forEach((c) => {
        c.style.border = "1px solid #cbd5e1";
        c.style.padding = "6px 10px";
      });

      html2pdf()
        .set({
          margin: 10,
          filename: `${safeTitle}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .save();
      return;
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

  const statusTone =
    status === "Saved"
      ? "text-teal-700"
      : status === "Couldn't save"
        ? "text-rose-600"
        : "text-amber-600";

  const sealTone =
    status === "Saved"
      ? "bg-teal-600"
      : status === "Couldn't save"
        ? "bg-rose-500"
        : "bg-amber-500 animate-pulse";

  if (loadingDoc) {
    return (
      <div className="min-h-screen bg-[#EEF1F6] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 text-sm font-mono tracking-wide">
          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
          {isNewDoc ? "Creating your document..." : "Loading document..."}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#EEF1F6] flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md text-center shadow-[0_8px_30px_rgba(20,30,50,0.08)]">
          <p className="text-slate-900 font-serif text-xl font-semibold mb-2">
            Something went wrong
          </p>
          <p className="text-sm text-slate-500 mb-6">{loadError}</p>
          <button
            onClick={() => navigate("/documents")}
            className="px-5 py-2.5 rounded-lg bg-[#14213D] text-white text-sm font-medium hover:bg-[#1B2A4A] transition-colors"
          >
            Back to documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF1F6]">
      {/* Letterhead */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/documents")}
              className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 text-lg transition-colors"
              aria-label="Back to documents"
            >
              ←
            </button>

            <div className="w-10 h-10 rounded-lg bg-[#14213D] text-[#F2C879] flex items-center justify-center font-serif font-semibold text-lg">
              §
            </div>

            <div>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setStatus("Unsaved changes");
                }}
                className="font-serif text-xl font-semibold bg-transparent outline-none text-slate-900 w-[420px] border-b border-transparent focus:border-[#0F6B5C] transition-colors pb-0.5"
              />

              <p
                className={`text-[11px] font-mono uppercase tracking-wider mt-0.5 flex items-center gap-1.5 ${statusTone}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${sealTone}`} />
                {status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveDocument}
              className="px-5 py-2.5 rounded-lg bg-[#0F6B5C] hover:bg-[#0C5449] text-white font-semibold text-sm transition-colors shadow-sm"
            >
              Save
            </button>

            <button
              disabled={sharing}
              onClick={() => setShowShareModal(true)}
              className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors"
            >
              {sharing ? "Sharing..." : "Share"}
            </button>

            <select
              defaultValue=""
              onChange={(e) => {
                exportDocument(e.target.value);
                e.target.value = "";
              }}
              className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm outline-none hover:bg-slate-50 text-slate-700 transition-colors"
            >
              <option value="" disabled>
                Export
              </option>
              <option value="html">HTML</option>
              <option value="pdf">PDF</option>
            </select>

            <div className="w-9 h-9 rounded-full bg-[#14213D] text-[#F2C879] flex items-center justify-center font-serif font-semibold">
              {currentUser?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-[1600px] mx-auto grid grid-cols-[1fr_320px] gap-6">
          <section>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgba(20,30,50,0.06)] overflow-hidden">
              <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div>
                  <p className="text-sm font-serif font-semibold text-slate-800">
                    Document Editor
                  </p>
                  <p className="text-xs text-slate-400">
                    Write, format, save, and collaborate
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  Live workspace
                </div>
              </div>

              <div className="bg-[#F4F6FA] px-10 py-10">
                <div className="mx-auto max-w-[900px] min-h-[900px] bg-white border border-slate-200 shadow-[0_2px_16px_rgba(20,30,50,0.06)] rounded-lg px-16 py-14">
                  <TiptapEditor
                    content={content}
                    setContent={setContent}
                    setStatus={setStatus}
                    socketRef={socketRef}
                    isRemote={isRemote}
                    onSave={saveDocument}
                    onExport={exportDocument}
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-5 sticky top-24 h-fit">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-serif font-semibold text-slate-900 mb-4 flex items-center gap-2 text-[15px]">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                Online Users
              </h3>

              {onlineUsers.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Nobody online right now
                </p>
              ) : (
                <div className="space-y-2">
                  {onlineUsers.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                      <span className="text-sm font-medium text-slate-700">
                        {user}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-serif font-semibold text-slate-900 mb-4 text-[15px]">
                Collaborators
              </h3>

              <div className="space-y-2 max-h-[420px] overflow-y-auto">
                {collaborators.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No collaborators yet
                  </p>
                ) : (
                  collaborators.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2.5"
                    >
                      <div>
                        <p className="font-semibold text-sm text-slate-800">
                          {user.username}
                        </p>
                        <p className="text-xs text-slate-500 capitalize font-mono">
                          {user.role}
                        </p>
                      </div>

                      {user.role === "owner" ? (
                        <span className="text-[11px] font-mono uppercase tracking-wide bg-[#14213D] text-[#F2C879] px-2 py-1 rounded-full">
                          Owner
                        </span>
                      ) : isOwner ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              updateRole(user.id, e.target.value)
                            }
                            className="border rounded-md px-2 py-1 text-xs bg-white"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                          </select>

                          <button
                            onClick={() => removeCollaborator(user.id)}
                            className="text-rose-500 hover:text-rose-700 text-sm"
                            aria-label="Remove collaborator"
                          >
                            ✕
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-[#14213D] rounded-2xl shadow-md p-6 text-white">
              <h3 className="font-serif font-semibold mb-2 text-[#F2C879]">
                Workspace Tip
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Use Share to invite others. Real-time updates will appear when
                WebSocket sync is active.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {showShareModal && (
        <div
          className="fixed inset-0 bg-[#0B1120]/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-[440px] p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-serif font-semibold text-slate-900">
              Share Document
            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Invite people to view or edit this document.
            </p>

            <input
              type="email"
              placeholder="Enter collaborator email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-[#0F6B5C] focus:border-transparent outline-none"
            />

            <select
              value={shareRole}
              onChange={(e) => setShareRole(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-6 outline-none"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={shareDocument}
                className="px-5 py-2 rounded-lg bg-[#0F6B5C] hover:bg-[#0C5449] text-white font-semibold transition-colors"
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