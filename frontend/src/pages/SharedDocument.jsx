import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SharedDocument() {
    const { id } = useParams();
    const [doc, setDoc] = useState(null);

    useEffect(() => {
        const savedDoc = JSON.parse(localStorage.getItem(`doc-${id}`));
        setDoc(savedDoc);
    }, [id]);

    if (!doc) {
        return <h2 style={{ padding: "40px" }}>Document not found</h2>;
    }

    return (
        <div style={{ minHeight: "100vh", background: "#eef4fb", padding: "40px" }}>
            <div style={styles.paper}>
                <h1>{doc.title}</h1>
                <p style={{ color: "#64748b" }}>Read-only shared document</p>
                <hr />
                <div dangerouslySetInnerHTML={{ __html: doc.content }} />
            </div>
        </div>
    );
}

const styles = {
    paper: {
        maxWidth: "850px",
        minHeight: "900px",
        margin: "0 auto",
        background: "white",
        padding: "70px",
        borderRadius: "18px",
        boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
        fontSize: "18px",
        lineHeight: "1.8",
    },
};

export default SharedDocument;