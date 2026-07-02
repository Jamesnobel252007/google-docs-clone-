import { useEffect, useState,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TiptapEditor from "../components/TiptapEditor";
import api from "../api/api";
function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sharing, setSharing] = useState(false);
  const [title, setTitle] = useState("Untitled Document");
  const [status, setStatus] = useState("Saved");
  const [content, setContent] = useState("<p></p>");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState("viewer");
const socketRef = useRef(null);
const isRemote = useRef(false);



  useEffect(() => {
    fetchDocument();
  }, [id]);

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
    if (status !== "Unsaved changes") return;

    const timer = setTimeout(() => {
      saveDocument();
    }, 1500);

    return () => clearTimeout(timer);
  }, [content, title]);

useEffect(() => {
  socketRef.current = new WebSocket(
    `ws://127.0.0.1:8000/ws/documents/${id}/`
  );

  socketRef.current.onopen = () => {
    console.log("WS connected");
  };

  socketRef.current.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("Received:", data);

    isRemote.current = true;
    setContent(data.message);
  };

  return () => {
    socketRef.current.close();
  };
}, [id]);

window.socketRef = socketRef;

  const fetchDocument = async () => {
    try {
      const { data } = await api.get(`documents/${id}/`);

      setTitle(data.title);
      setContent(data.content);

    } catch (err) {
      console.error(err);
    }
  };

  const shareDocument = async () => {
    if (!shareEmail.trim()) return;

    setSharing(true);

    try {
      await api.post("share/", {
        document_id: id,
        email: shareEmail,
        role: shareRole,
      });

      alert("Document shared successfully!");

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
    }

  }

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
              className={`text-xs mt-1 font-medium ${status === "Saved"
                ? "text-emerald-500"
                : "text-orange-500"
                }`}
            >
              {status}
            </p>

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Share
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

            <option value="html">
              HTML
            </option>

            <option value="csv">
              CSV
            </option>

            <option value="excel">
              Excel
            </option>

          </select>

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow">
            S
          </div>

        </div>

      </header>

      {/* Editor Body */}

      <main className="py-10 px-6">

        <div className="max-w-5xl mx-auto">

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 min-h-[85vh] p-10">

            <TiptapEditor
  content={content}
  setContent={setContent}
  setStatus={setStatus}
  socketRef={socketRef}
  isRemote={isRemote}
/>

          </div>

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

            <h2 className="text-2xl font-bold text-slate-800">
              Share Document
            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Invite collaborators to edit or view this document.
            </p>

            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  shareDocument();
                }
              }}
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