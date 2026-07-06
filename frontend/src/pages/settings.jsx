import { useEffect, useRef, useState } from "react";
import api from "../api/api";

const STORAGE_KEY = "vdocsProfile";
const THEME_KEY = "vdocsTheme";
const NOTIF_KEY = "vdocsNotifications";

const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "theme", label: "Theme" },
  { id: "notifications", label: "Notifications" },
];

const DEFAULT_PROFILE = { name: "", email: "", bio: "" };
const DEFAULT_NOTIFS = {
  documentShared: true,
  comments: true,
  weeklyDigest: false,
  productUpdates: false,
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function SettingsAlt() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [theme, setTheme] = useState("light");
  const [notifs, setNotifs] = useState(DEFAULT_NOTIFS);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const sectionRefs = {
    profile: useRef(null),
    theme: useRef(null),
    notifications: useRef(null),
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get("me/");

setProfile({
    name: res.data.username,
    email: res.data.email,
    bio: "",
});

        setTheme(localStorage.getItem(THEME_KEY) || "light");
        setNotifs(loadJSON(NOTIF_KEY, DEFAULT_NOTIFS));
      } catch (err) {
        console.error(err);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    sectionRefs[id].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

const saveProfile = async (e) => {
  e.preventDefault();

  try {
    await api.patch("me/", {
    username: profile.name,
    email: profile.email,
});

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    setSaved(true);
  } catch (err) {
    console.error(err);
  }
};
  const selectTheme = (value) => {
    setTheme(value);
    localStorage.setItem(THEME_KEY, value);
  };

  const toggleNotif = (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
  };

  return (
    <div className="flex gap-10 p-8 max-w-5xl">
      {/* Sticky side nav */}
      <nav className="w-40 shrink-0">
        <div className="sticky top-8 space-y-1">
          <p className="text-xs font-medium text-[#84808E] uppercase tracking-wide mb-3 px-3">
            Settings
          </p>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeSection === s.id
                  ? "bg-[#EFEBFB] text-[#6D5BD0] font-medium"
                  : "text-[#5B5768] hover:bg-[#F5F4F8]"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Scrollable content */}
      <div className="flex-1 space-y-6 max-w-lg">
        {/* Profile card */}
        <section
          ref={sectionRefs.profile}
          className="bg-white border border-[#E4E1EC] rounded-2xl p-6"
        >
          <h2 className="text-base font-semibold text-[#232231] mb-1">
            Profile
          </h2>
          <p className="text-sm text-[#84808E] mb-5">
            How you appear across your workspace.
          </p>

          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#232231] mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Sujay Kumar"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DEDCE4] bg-[#FBFAFC] text-sm text-[#232231] placeholder:text-[#B4B0BE] outline-none focus:ring-2 focus:ring-[#6D5BD0]/25 focus:border-[#6D5BD0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#232231] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DEDCE4] bg-[#FBFAFC] text-sm text-[#232231] placeholder:text-[#B4B0BE] outline-none focus:ring-2 focus:ring-[#6D5BD0]/25 focus:border-[#6D5BD0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#232231] mb-1.5">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="A short line about yourself"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DEDCE4] bg-[#FBFAFC] text-sm text-[#232231] placeholder:text-[#B4B0BE] outline-none focus:ring-2 focus:ring-[#6D5BD0]/25 focus:border-[#6D5BD0] transition resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#6D5BD0] text-white text-sm font-medium hover:bg-[#5E4EBD] active:scale-[0.98] transition"
              >
                Save changes
              </button>
              {saved && <span className="text-sm text-[#0F6E56]">Saved</span>}
            </div>
          </form>
        </section>

        {/* Theme card */}
        <section
          ref={sectionRefs.theme}
          className="bg-white border border-[#E4E1EC] rounded-2xl p-6"
        >
          <h2 className="text-base font-semibold text-[#232231] mb-1">
            Theme
          </h2>
          <p className="text-sm text-[#84808E] mb-5">
            Choose how VDocs looks on your screen.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "light", label: "Light", bg: "#FFFFFF" },
              { id: "dark", label: "Dark", bg: "#1F2430" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => selectTheme(option.id)}
                className={`rounded-xl border-2 p-3 text-left transition ${theme === option.id
                    ? "border-[#6D5BD0]"
                    : "border-[#E4E1EC] hover:border-[#C7C2D6]"
                  }`}
              >
                <div
                  className="w-full h-14 rounded-lg mb-2.5 border border-[#E4E1EC]"
                  style={{ backgroundColor: option.bg }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#232231]">
                    {option.label}
                  </span>
                  {theme === option.id && (
                    <span className="text-xs text-[#6D5BD0] font-medium">
                      Active
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-[#B4B0BE] mt-3">
            This saves your preference — dark mode styling isn't applied
            app-wide yet.
          </p>
        </section>

        {/* Notifications card */}
        <section
          ref={sectionRefs.notifications}
          className="bg-white border border-[#E4E1EC] rounded-2xl p-6"
        >
          <h2 className="text-base font-semibold text-[#232231] mb-1">
            Notifications
          </h2>
          <p className="text-sm text-[#84808E] mb-4">
            Choose what you want to hear about.
          </p>

          <div className="space-y-0">
            {[
              { key: "documentShared", label: "Document shared with you", desc: "When someone shares a document with you." },
              { key: "comments", label: "Comments", desc: "When someone comments on your document." },
              { key: "weeklyDigest", label: "Weekly digest", desc: "A summary of your activity every week." },
              { key: "productUpdates", label: "Product updates", desc: "New features and announcements." },
            ].map((item, i) => (
              <div
                key={item.key}
                className={`flex items-start justify-between py-4 ${i !== 0 ? "border-t border-[#EDEBF2]" : ""
                  }`}
              >
                <div className="pr-4">
                  <p className="text-sm font-medium text-[#232231]">{item.label}</p>
                  <p className="text-xs text-[#84808E] mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotif(item.key)}
                  role="switch"
                  aria-checked={notifs[item.key]}
                  className={`relative w-10 h-6 rounded-full shrink-0 transition ${notifs[item.key] ? "bg-[#6D5BD0]" : "bg-[#E4E1EC]"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifs[item.key] ? "translate-x-4" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
