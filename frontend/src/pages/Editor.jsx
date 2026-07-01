import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TiptapEditor from "../components/TiptapEditor";
import api from "../api/api";
function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("Untitled Document");
  const [status, setStatus] = useState("Saved");
  const [content, setContent] = useState("<p></p>");


  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const { data } = await api.get(`documents/${id}/`);

      setTitle(data.title);
      setContent(data.content);

    } catch (err) {
      console.error(err);
    }
  };

  const saveDocument = async () => {

    try{

        await api.patch(`documents/${id}/`,{
            title,
            content,
        });

        setStatus("Saved");

    }catch(err){
        console.error(err);
    }

}
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
        <TiptapEditor
          content={content}
          setContent={setContent}
          setStatus={setStatus}
        />
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