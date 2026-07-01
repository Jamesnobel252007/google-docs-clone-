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

      let endpoint =
        tab === "sharedToMe"
          ? "shared-documents/"
          : "my-shared-documents/";

      const { data } = await api.get(endpoint);

      setDocuments(data);
    } catch (err) {
      console.error(err);
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

  const collaboratorColors = [
    "bg-rose-400",
    "bg-amber-400",
    "bg-emerald-400",
  ];

  return (
    <div
      className="min-h-screen bg-[#F9FBFD] flex"
      onClick={() => setSortMenuOpen(false)}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header search={search} setSearch={setSearch} />

        <main className="flex-1 max-w-7xl mx-auto w-full p-8 pb-24">

          {/* Heading */}

          <div className="flex justify-between items-center mb-6">

            <div>

              <h1 className="text-2xl font-bold">
                Shared Documents
              </h1>

              <p className="text-slate-500 mt-1">
                Documents shared with you and by you
              </p>

            </div>

            <div className="flex items-center gap-3">

              {/* Sort */}

              <div
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >

                <button
                  onClick={() => setSortMenuOpen(!sortMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border"
                >
                  <ArrowUpDown size={15} />
                  {sortOrder === "newest"
                    ? "Newest"
                    : "Oldest"}

                  <ChevronDown size={14} />
                </button>

                {sortMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-xl border shadow-lg w-40">

                    <button
                      className="w-full px-4 py-2 hover:bg-slate-50 text-left"
                      onClick={() => {
                        setSortOrder("newest");
                        setSortMenuOpen(false);
                      }}
                    >
                      Newest First
                    </button>

                    <button
                      className="w-full px-4 py-2 hover:bg-slate-50 text-left"
                      onClick={() => {
                        setSortOrder("oldest");
                        setSortMenuOpen(false);
                      }}
                    >
                      Oldest First
                    </button>

                  </div>
                )}

              </div>

              {/* Grid List */}

              <div className="bg-slate-100 rounded-xl p-1 flex">

                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                    viewMode === "grid"
                      ? "bg-white shadow"
                      : ""
                  }`}
                >
                  <Grid3x3 size={15} />
                  Grid
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                    viewMode === "list"
                      ? "bg-white shadow"
                      : ""
                  }`}
                >
                  <List size={15} />
                  List
                </button>

              </div>

            </div>

          </div>

          {/* Tabs */}

          <div className="flex gap-4 mb-8">

            <button
              onClick={() => setTab("sharedToMe")}
              className={`px-5 py-2 rounded-xl font-semibold ${
                tab === "sharedToMe"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              Shared To Me
            </button>

            <button
              onClick={() => setTab("sharedByMe")}
              className={`px-5 py-2 rounded-xl font-semibold ${
                tab === "sharedByMe"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              Shared By Me
            </button>

          </div>

          {/* List Header */}

          {viewMode === "list" &&
            filteredDocuments.length > 0 && (
              <div className="flex justify-between px-6 text-xs font-bold text-slate-400 uppercase mb-2">
                <span>Name</span>
                <span>Updated</span>
              </div>
            )}

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
                onClick={() =>
                  navigate(`/editor/${doc.id}`)
                }
                className={`bg-white rounded-2xl border p-6 cursor-pointer hover:shadow-lg transition ${
                  viewMode === "grid"
                    ? "min-h-[180px]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex justify-center items-center text-blue-600">
                    <FileText size={20} />
                  </div>

                  <div className="flex-1">

                    <h3 className="font-bold">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      Updated{" "}
                      {new Date(
                        doc.updated_at
                      ).toLocaleString()}
                    </p>

                    <div className="flex mt-3 -space-x-2">

                      {collaboratorColors.map((color, i) => (
                        <div
                          key={i}
                          className={`h-6 w-6 rounded-full border-2 border-white ${color}`}
                        />
                      ))}

                    </div>

                  </div>

                </div>

              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border mt-6">

              <Search
                className="mx-auto text-slate-300 mb-3"
                size={28}
              />

              <h2 className="font-bold text-lg">
                No Shared Documents
              </h2>

              <p className="text-slate-400 mt-1">
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