import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);

  const navigate = useNavigate();

  const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser")) || { username: "User" };

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
    const now = new Date().toLocaleString();

    const newDoc = {
      id: Date.now(),
      title: "Untitled Document",
      date: "Today",
      lastEdited: now,
    };

    const updatedDocs = [newDoc, ...documents];
    updateDocuments(updatedDocs);

    localStorage.setItem(
      `doc-${newDoc.id}`,
      JSON.stringify({
        id: newDoc.id,
        title: newDoc.title,
        content: "<p></p>",
        updatedAt: now,
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

  const renameDocument = (e, id) => {
    e.stopPropagation();

    const currentDoc = documents.find((doc) => doc.id === id);
    const newTitle = prompt("Enter new document name", currentDoc.title);

    if (!newTitle || newTitle.trim() === "") return;

    const now = new Date().toLocaleString();

    const updatedDocs = documents.map((doc) =>
      doc.id === id
        ? { ...doc, title: newTitle.trim(), lastEdited: now }
        : doc
    );

    updateDocuments(updatedDocs);

    const savedDoc = JSON.parse(localStorage.getItem(`doc-${id}`));

    if (savedDoc) {
      localStorage.setItem(
        `doc-${id}`,
        JSON.stringify({
          ...savedDoc,
          title: newTitle.trim(),
          updatedAt: now,
        })
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f6f8fc" }}>
      <div
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          backgroundColor: "white",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              fontSize: "30px",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#202124",
            }}
          >
            ☰
          </button>

          <h2 style={{ color: "#202124", margin: 0, fontWeight: "700" }}>
            VDocs
          </h2>
        </div>

        <input
          type="text"
          placeholder="Search documents"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "520px",
            padding: "14px 24px",
            borderRadius: "32px",
            border: "1px solid transparent",
            backgroundColor: "#eef3f8",
            fontSize: "16px",
            color: "#202124",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            title={loggedInUser.username}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#4285F4",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "20px",
              boxShadow: "0 4px 12px rgba(66,133,244,0.35)",
              textTransform: "uppercase",
            }}
          >
            {loggedInUser.username.charAt(0)}
          </div>

          <button
            onClick={handleLogout}
            style={{
              border: "none",
              background: "#ef4444",
              color: "white",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            width: "260px",
            height: "100vh",
            background: "white",
            boxShadow: "4px 0 16px rgba(0,0,0,0.14)",
            padding: "24px",
            position: "absolute",
            left: 0,
            top: "72px",
            zIndex: 15,
          }}
        >
          <h3 style={{ color: "#202124", marginBottom: "24px" }}>Menu</h3>
          <p style={{ color: "#202124", marginBottom: "18px" }}>🏠 Home</p>
          <p style={{ color: "#202124", marginBottom: "18px" }}>📄 Documents</p>
          <p style={{ color: "#202124", marginBottom: "18px" }}>⚙️ Settings</p>
          <p style={{ color: "#202124", marginTop: "30px" }}>
            Logged in as: <b>{loggedInUser.username}</b>
          </p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: "20px",
          padding: "45px 40px",
          alignItems: "start",
        }}
      >
        <div>
          <h3 style={{ marginBottom: "18px", color: "#202124" }}>
            Recent documents
          </h3>

          {filteredDocuments.length === 0 && (
            <p style={{ color: "#5f6368" }}>No documents found</p>
          )}

          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/editor/${doc.id}`)}
              style={{
                backgroundColor: "white",
                padding: "12px 14px",
                marginBottom: "8px",
                borderRadius: "12px",
                border: "1px solid #e0e3e7",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
                minHeight: "92px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#202124",
                    fontWeight: "600",
                    fontSize: "15px",
                    margin: "0 0 6px 0",
                  }}
                >
                  {doc.title}
                </p>

                <small style={{ color: "#5f6368", display: "block" }}>
                  Last edited: {doc.lastEdited || doc.date || "Not edited"}
                </small>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  onClick={(e) => renameDocument(e, doc.id)}
                  style={{
                    border: "none",
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    padding: "6px 9px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Rename
                </button>

                <button
                  onClick={(e) => deleteDocument(e, doc.id)}
                  style={{
                    border: "none",
                    background: "#fee2e2",
                    color: "#b91c1c",
                    padding: "6px 9px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "70px",
            boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
            textAlign: "center",
            width: "650px",
            height: "400px",
            margin: "0 auto",
          }}
        >
          <h3 style={{ marginBottom: "28px", color: "#202124" }}>
            Start a new document
          </h3>

          <div
            onClick={createDocument}
            style={{
              width: "170px",
              height: "160px",
              backgroundColor: "#f8fafd",
              border: "2px dashed #cbd5e1",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "64px",
              color: "#4285F4",
              cursor: "pointer",
              margin: "0 auto",
            }}
          >
            +
          </div>

          <p
            style={{
              marginTop: "16px",
              color: "#202124",
              fontWeight: "600",
            }}
          >
            Blank Document
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;