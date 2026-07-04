import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { FileText, Search } from "lucide-react";

function Shared() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [tab, setTab] = useState("sharedToMe");

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const endpoint =
          tab === "sharedToMe"
            ? "shared-documents/"
            : "shared-by-me/";

        const { data } = await api.get(endpoint);
        setDocuments(data);
      } catch (err) {
        console.error("Failed to fetch shared docs", err);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [tab]);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [documents, search]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FBFD] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header search={search} setSearch={setSearch} />

        <main className="flex-1 max-w-7xl mx-auto w-full p-8">

          <h1 className="text-2xl font-bold mb-6">Shared Documents</h1>

          <div className="flex gap-4 mb-6">
            <button onClick={() => setTab("sharedToMe")}
              className={tab === "sharedToMe" ? "bg-blue-600 text-white px-4 py-2 rounded-xl" : "px-4 py-2 border rounded-xl"}>
              Shared To Me
            </button>

            <button onClick={() => setTab("sharedByMe")}
              className={tab === "sharedByMe" ? "bg-blue-600 text-white px-4 py-2 rounded-xl" : "px-4 py-2 border rounded-xl"}>
              Shared By Me
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {filteredDocuments.map(doc => (
              <div
                key={doc.id}
                onClick={() => navigate(`/editor/${doc.id}`)}
                className="bg-white p-5 border rounded-xl cursor-pointer"
              >
                <FileText />
                <h3>{doc.title}</h3>
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-20 bg-white border rounded-xl">
              <Search className="mx-auto text-slate-300" />
              <h2>No shared documents</h2>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Shared;