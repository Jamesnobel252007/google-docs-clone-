import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
// TEMP MOCK — swap this for a real API call once your friend's backend is ready.
// Expected shape from backend: GET /api/dashboard/
//   { stats: { totalDocs, sharedDocs, favoriteDocs, storageUsedMB, storageLimitMB },
//     recentDocuments: [{ id, title, updatedAt, isFavorite, isShared, owner }] }

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: "🏠" },
  { label: "Documents", path: "/documents", icon: "📄" },
  { label: "Shared with you", path: "/shared", icon: "🔗" },
  { label: "Favorites", path: "/favorites", icon: "⭐" },
  { label: "Trash", path: "/trash", icon: "🗑️" },
];

async function fetchDashboardData() {
  const { data: documents } = await api.get("documents/");

  const activeDocuments = documents.filter((doc) => !doc.is_trashed);

  const stats = {
    totalDocs: activeDocuments.length,

    favoriteDocs: activeDocuments.filter(
      (doc) => doc.is_favorite
    ).length,

    // Until you have a dedicated shared endpoint
    sharedDocs: activeDocuments.filter(
      (doc) => doc.owner !== null
    ).length,

    storageUsedMB: 0,
    storageLimitMB: 500,
  };

  const recentDocuments = activeDocuments
    .sort(
      (a, b) =>
        new Date(b.updated_at) -
        new Date(a.updated_at)
    )
    .slice(0, 4)
    .map((doc) => ({
      id: doc.id,
      title: doc.title,
      updatedAt: doc.updated_at,
      isFavorite: doc.is_favorite,
      isShared: doc.owner !== null,
    }));

  return {
    stats,
    recentDocuments,
  };
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

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E6E4DD] flex flex-col transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="h-16 flex items-center gap-2 px-5 border-b border-[#E6E4DD]">
          <div className="w-7 h-7 rounded-md bg-[#3D5AFE] flex items-center justify-center text-white text-sm font-semibold">
            D
          </div>
          <span className="text-sm font-semibold text-[#12141C]">Docly</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${active
                  ? "bg-[#EEF1FF] text-[#3D5AFE]"
                  : "text-[#4B5563] hover:bg-[#F1EFE8]"
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#E6E4DD]">
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#4B5563] hover:bg-[#F1EFE8] transition"
          >
            <span className="text-base">⚙️</span>
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenuClick, userName = "Alex" }) {
  return (
    <header className="h-16 flex items-center justify-between gap-4 px-4 lg:px-8 border-b border-[#E6E4DD] bg-white sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1EFE8] transition shrink-0"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="#12141C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative hidden sm:block w-full max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width="15" height="15" viewBox="0 0 15 15" fill="none"
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="#9CA3AF" strokeWidth="1.4" />
            <path d="M10.5 10.5L13 13" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#E6E4DD] bg-[#FAFAF7] text-[#12141C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3D5AFE]/30 focus:border-[#3D5AFE]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1EFE8] transition relative"
          aria-label="Notifications"
        >
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path
              d="M8.5 2a4 4 0 0 0-4 4v2.2c0 .5-.18.98-.5 1.36L3 10.8c-.5.6-.08 1.5.7 1.5h9.6c.78 0 1.2-.9.7-1.5l-1-1.24a2.1 2.1 0 0 1-.5-1.36V6a4 4 0 0 0-4-4Z"
              stroke="#4B5563" strokeWidth="1.3" strokeLinejoin="round"
            />
            <path d="M6.8 14a1.8 1.8 0 0 0 3.4 0" stroke="#4B5563" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3D5AFE]" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-[#E6E4DD]">
          <div className="w-8 h-8 rounded-full bg-[#3D5AFE] flex items-center justify-center text-white text-xs font-semibold">
            {userName.charAt(0)}
          </div>
          <span className="hidden sm:block text-sm font-medium text-[#12141C]">{userName}</span>
        </div>
      </div>
    </header>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1">
          {loading ? (
            <div className="p-8">
              <div className="h-8 w-48 bg-[#F1EFE8] rounded animate-pulse mb-3" />
              <div className="h-4 w-72 bg-[#F1EFE8] rounded animate-pulse mb-8" />
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-[#F1EFE8] rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="bg-[#FEF3F2] border border-[#FDA29B] text-[#B42318] text-sm rounded-lg px-4 py-3 max-w-md">
                {error}
              </div>
            </div>
          ) : (
            <DashboardContent
              data={data}
              navigate={navigate}
              handleCreateDocument={handleCreateDocument}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardContent({ data, navigate, handleCreateDocument }) {
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
