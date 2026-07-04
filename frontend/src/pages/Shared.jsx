import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  FileText,
  Search,
  Grid3x3,
  List,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

function Shared() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [tab, setTab] = useState("sharedToMe");

  useEffect(() => {
    fetchDocuments();
  }, [tab]);

  const fetchDocuments = async () => {
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

  const filteredDocuments = useMemo(() => {
    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.updated_at) - new Date(a.updated_at);
      }
      return new Date(a.updated_at) - new Date(b.updated_at);
    });
  }, [documents, search, sortOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBFD] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header search={search} setSearch={setSearch} />

        <main className="flex-1 max-w-7xl mx-auto w-full p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Shared Documents</h1>
              <p className="text-slate-500">
                Documents shared with you and by you
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTab("sharedToMe")}
              className={`px-4 py-2 rounded-xl ${
                tab === "sharedToMe"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              Shared To Me
            </button>

            <button
              onClick={() => setTab("sharedByMe")}
              className={`px-4 py-2 rounded-xl ${
                tab === "sharedByMe"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              Shared By Me
            </button>
          </div>

          {/* List */}
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "flex flex-col gap-3"
            }
          >
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/editor/${doc.id}`)}
                className="bg-white rounded-2xl border p-6 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold">{doc.title}</h3>
                    <p className="text-xs text-slate-400">
                      Updated{" "}
                      {new Date(doc.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border mt-6">
              <Search className="mx-auto text-slate-300 mb-3" size={28} />
              <h2 className="font-bold text-lg">No Shared Documents</h2>
              <p className="text-slate-400">
                Nothing has been shared yet.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Shared;