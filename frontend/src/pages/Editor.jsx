import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import TiptapEditor from "../components/TiptapEditor";

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("Untitled Document");
  const [status, setStatus] = useState("Saved");
  const [content, setContent] = useState("<p></p>");

  useEffect(() => {
    const savedDoc = JSON.parse(localStorage.getItem(`doc-${id}`));
    if (savedDoc) {
      setTitle(savedDoc.title);
      setContent(savedDoc.content);
    }
  }, [id]);

  const saveToLocalStorage = () => {
    const docData = { id, title, content, updatedAt: new Date().toLocaleString() };
    localStorage.setItem(`doc-${id}`, JSON.stringify(docData));

    let docs = JSON.parse(localStorage.getItem("documents-list")) || [];
    const existingIndex = docs.findIndex((doc) => String(doc.id) === String(id));

    if (existingIndex !== -1) {
      docs[existingIndex].title = title;
      docs[existingIndex].date = "Today";
    } else {
      docs.unshift({ id: Number(id), title, date: "Today" });
    }

    localStorage.setItem("documents-list", JSON.stringify(docs));
  };

  const saveDocument = () => {
    saveToLocalStorage();
    setStatus("Saved");
    alert("Document saved successfully!");
  };

  const shareDocument = () => {
    saveToLocalStorage();
    const shareLink = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(shareLink);
    alert("Share link copied to clipboard!");
  };

  const getPlainText = () => {
    return content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  };

  const exportDocument = (type) => {
    if (!type) return;

    const fileName = title.trim() || "document";

    if (type === "html") {
      const htmlContent = `
        <html>
          <head><title>${fileName}</title></head>
          <body>
            <h1>${fileName}</h1>
            ${content}
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${fileName}.html`;
      link.click();

      URL.revokeObjectURL(url);
    }

    if (type === "csv") {
      const csvContent = `Title,Content\n"${fileName}","${getPlainText()}"`;
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${fileName}.csv`;
      link.click();

      URL.revokeObjectURL(url);
    }

    if (type === "excel") {
      const worksheet = XLSX.utils.json_to_sheet([
        { Title: fileName, Content: getPlainText() },
      ]);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Document");
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
  };

  useEffect(() => {
    if (status !== "Unsaved changes") return;

    const timer = setTimeout(() => {
      saveToLocalStorage();
      setStatus("Saved");
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, title]);

  return (
    <div style={{ minHeight: "100vh", background: "#eef4fb" }}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button style={backBtn} onClick={() => navigate("/dashboard")}>
            ←
          </button>

          <div style={docIcon}>📄</div>

          <div>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setStatus("Unsaved changes");
              }}
              style={titleInput}
            />
            <p style={statusText}>{status}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button style={btnStyle} onClick={shareDocument}>
            Share
          </button>

          <button style={btnBlue} onClick={saveDocument}>
            Save
          </button>

          <select
            style={btnStyle}
            defaultValue=""
            onChange={(e) => {
              exportDocument(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="" disabled>
              Export
            </option>
            <option value="html">Export as HTML</option>
            <option value="csv">Export as CSV</option>
            <option value="excel">Export as Excel</option>
          </select>

          <div style={profileStyle}>S</div>
        </div>
      </div>

      <div style={{ padding: "42px 35px" }}>
        <TiptapEditor content={content} setContent={setContent} setStatus={setStatus} />
      </div>
    </div>
  );
}

const headerStyle = {
  height: "78px",
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(12px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 36px",
  boxShadow: "0 8px 30px rgba(15,23,42,0.08)",
  borderBottom: "1px solid #e5e7eb",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const backBtn = {
  border: "none",
  background: "transparent",
  fontSize: "26px",
  cursor: "pointer",
  color: "#111827",
};

const docIcon = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
};

const titleInput = {
  border: "none",
  outline: "none",
  fontSize: "20px",
  fontWeight: "700",
  color: "#111827",
  background: "transparent",
};

const statusText = {
  color: "#64748b",
  fontSize: "13px",
  margin: "4px 0 0 0",
};

const btnStyle = {
  padding: "10px 18px",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  background: "#ffffff",
  cursor: "pointer",
  color: "#111827",
  fontWeight: "600",
  fontSize: "14px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const btnBlue = {
  ...btnStyle,
  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
  color: "white",
  border: "none",
};

const profileStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  background: "linear-gradient(135deg,#2563eb,#60a5fa)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "18px",
  boxShadow: "0 6px 18px rgba(37,99,235,0.3)",
};

export default Editor;