import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TiptapEditor from "../components/TiptapEditor";
import api from "../api/api";
function Editor() {
  const { id } = useParams();

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
    <div style={{ minHeight: "100vh", background: "#eef1f5" }}>
      <div
        style={{
          height: "70px",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "30px" }}>📄</span>

          <div>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setStatus("Unsaved changes");
              }}
              style={{
                border: "none",
                outline: "none",
                fontSize: "22px",
                fontWeight: "700",
                color: "#202124",
                background: "transparent",
              }}
            />
            <p style={{ color: "#5f6368", fontSize: "13px" }}>{status}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button style={btnStyle}>Comment</button>

          <button style={btnBlue} onClick={saveDocument}>
            Save
          </button>

          <button style={btnStyle}>Export</button>

          <div style={profileStyle}>S</div>
        </div>
      </div>

      <div style={{ padding: "35px" }}>
        <TiptapEditor
          content={content}
          setContent={setContent}
          setStatus={setStatus}
        />
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "9px 16px",
  border: "1px solid #dadce0",
  borderRadius: "20px",
  background: "white",
  cursor: "pointer",
  color: "#202124",
};

const btnBlue = {
  ...btnStyle,
  background: "#1a73e8",
  color: "white",
  border: "none",
};

const profileStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#4285F4",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

export default Editor;