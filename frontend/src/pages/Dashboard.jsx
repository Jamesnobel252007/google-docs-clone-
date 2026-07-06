import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// TEMP MOCK — swap this for a real API call once your friend's backend is ready.
// Expected shape from backend: GET /api/dashboard/
//   { stats: { totalDocs, sharedDocs, favoriteDocs, storageUsedMB, storageLimitMB },
//     recentDocuments: [{ id, title, updatedAt, isFavorite, isShared, owner }] }
const USE_MOCK = true;

const MOCK_DASHBOARD = {
  stats: {
    totalDocs: 14,
    sharedDocs: 5,
    favoriteDocs: 3,
    storageUsedMB: 42,
    storageLimitMB: 500,
  },
  recentDocuments: [
    { id: 1, title: "Getting started", updatedAt: "2026-07-04T10:20:00Z", isFavorite: true, isShared: false },
    { id: 2, title: "Client proposal draft", updatedAt: "2026-07-03T15:45:00Z", isFavorite: false, isShared: true },
    { id: 3, title: "Team notes — sprint 4", updatedAt: "2026-07-02T09:10:00Z", isFavorite: true, isShared: true },
    { id: 4, title: "Product brief v2", updatedAt: "2026-06-30T18:00:00Z", isFavorite: false, isShared: false },
  ],
};

async function fetchDashboardData() {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_DASHBOARD), 300));
  }
  const res = await fetch("/api/dashboard/");
  if (!res.ok) throw new Error("Couldn't load dashboard data.");
  return res.json();
}

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateDocument = () => {
    // Swap for real create-doc API call + navigate(`/editor/${newId}`)
    navigate("/editor/new");
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 bg-[#F1EFE8] rounded animate-pulse mb-3" />
        <div className="h-4 w-72 bg-[#F1EFE8] rounded animate-pulse mb-8" />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#F1EFE8] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-[#FEF3F2] border border-[#FDA29B] text-[#B42318] text-sm rounded-lg px-4 py-3 max-w-md">
          {error}
        </div>
      </div>
    );
  }

  const { stats, recentDocuments } = data;
  const storagePercent = Math.round((stats.storageUsedMB / stats.storageLimitMB) * 100);

  const statCards = [
    { label: "Total documents", value: stats.totalDocs, icon: "📄" },
    { label: "Shared with you", value: stats.sharedDocs, icon: "🔗" },
    { label: "Favorites", value: stats.favoriteDocs, icon: "⭐" },
    { label: "Storage used", value: `${storagePercent}%`, icon: "📦" },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#12141C] mb-1">
            Your dashboard
          </h1>
          <p className="text-sm text-[#6B7280]">
            Here's what's happening across your documents.
          </p>
        </div>
        <button
          onClick={handleCreateDocument}
          className="px-4 py-2.5 rounded-lg bg-[#3D5AFE] text-white text-sm font-medium hover:bg-[#2F46D6] active:scale-[0.98] transition"
        >
          + New document
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-[#E6E4DD] rounded-xl p-4"
          >
            <div className="text-xl mb-2">{card.icon}</div>
            <p className="text-2xl font-semibold text-[#12141C] mb-0.5">
              {card.value}
            </p>
            <p className="text-xs text-[#6B7280]">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent documents */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#12141C]">
          Recent documents
        </h2>
        <button
          onClick={() => navigate("/documents")}
          className="text-sm text-[#3D5AFE] font-medium hover:underline"
        >
          View all
        </button>
      </div>

      {recentDocuments.length === 0 ? (
        <div className="border border-dashed border-[#E6E4DD] rounded-xl p-12 text-center">
          <p className="text-sm font-medium text-[#12141C] mb-1">
            No documents yet
          </p>
          <p className="text-sm text-[#6B7280] mb-4">
            Create your first document to get started.
          </p>
          <button
            onClick={handleCreateDocument}
            className="text-sm text-[#3D5AFE] font-medium hover:underline"
          >
            Create a document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentDocuments.map((doc) => (
            <button
              key={doc.id}
              onClick={() => navigate(`/editor/${doc.id}`)}
              className="text-left bg-white border border-[#E6E4DD] rounded-xl p-4 hover:border-[#3D5AFE]/40 hover:shadow-sm transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-md bg-[#EEF1FF] flex items-center justify-center text-sm">
                  📄
                </div>
                {doc.isFavorite && <span className="text-[#F5A524] text-sm">★</span>}
              </div>
              <p className="text-sm font-medium text-[#12141C] mb-1 truncate group-hover:text-[#3D5AFE]">
                {doc.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <span>{timeAgo(doc.updatedAt)}</span>
                {doc.isShared && (
                  <span className="px-1.5 py-0.5 rounded bg-[#F1EFE8] text-[#6B7280]">
                    Shared
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
