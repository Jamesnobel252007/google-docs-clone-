import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { User, Palette, Bell, Upload, Check } from "lucide-react";

function Settings() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const savedProfile = JSON.parse(localStorage.getItem("vdocsProfile")) || {
    firstName: "Sujay",
    lastName: "Bobby",
    email: "sujaybobby1@gmail.com",
    bio: "B.Tech IT student and MERN intern building collaborative document systems.",
  };

  const [profile, setProfile] = useState(savedProfile);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const saveProfile = () => {
    localStorage.setItem("vdocsProfile", JSON.stringify(profile));
    alert("Profile saved successfully!");
  };

  const discardChanges = () => {
    setProfile(savedProfile);
  };

  const tabs = [
    { id: "profile", label: "Profile Details", icon: <User size={16} /> },
    { id: "theme", label: "Theme & Branding", icon: <Palette size={16} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F9FBFD] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header search={search} setSearch={setSearch} />

        <main className="p-8 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl font-black text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-2">
            Manage your VDocs profile, workspace theme, and notifications.
          </p>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mt-8">
            <div className="flex border-b border-slate-200 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-5 text-sm font-bold border-b-2 transition ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "profile" && (
              <div className="grid grid-cols-3 gap-10 p-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Public Profile
                  </h2>
                  <p className="text-sm text-slate-500 mt-3 leading-6">
                    This information appears on your profile and collaborator
                    activity.
                  </p>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl font-black">
                      {profile.firstName.charAt(0).toUpperCase()}
                    </div>

                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700">
                      <Upload size={16} />
                      Upload Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <Field
                      label="First Name"
                      value={profile.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                    />

                    <Field
                      label="Last Name"
                      value={profile.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                    />
                  </div>

                  <div className="mt-5">
                    <Field
                      label="Email Address"
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>

                  <div className="mt-5">
                    <label className="text-sm font-bold text-slate-700">
                      Professional Bio
                    </label>
                    <textarea
                      className="w-full mt-2 border border-slate-200 rounded-2xl p-4 h-32 outline-none text-slate-700"
                      value={profile.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      onClick={discardChanges}
                      className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Discard
                    </button>

                    <button
                      onClick={saveProfile}
                      className="px-6 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "theme" && (
              <div className="p-8">
                <h2 className="text-xl font-black text-slate-900">
                  Theme & Branding
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Customize your VDocs workspace appearance.
                </p>

                <div className="grid grid-cols-3 gap-5 mt-8">
                  <ThemeCard title="Light Mode" desc="Clean bright interface" active />
                  <ThemeCard title="Dark Mode" desc="Low-light workspace" />
                  <ThemeCard title="VDart Blue" desc="Brand color theme" />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="p-8">
                <h2 className="text-xl font-black text-slate-900">
                  Notifications
                </h2>
                <p className="text-sm text-slate-500 mt-2 mb-6">
                  Control alerts and document activity notifications.
                </p>

                {[
                  "Document shared with me",
                  "Comments and mentions",
                  "Document updates",
                  "Email notifications",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center border-b border-slate-100 py-5"
                  >
                    <span className="font-bold text-slate-800">{item}</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        className="w-full mt-2 border border-slate-200 rounded-2xl p-4 outline-none text-slate-700"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function ThemeCard({ title, desc, active }) {
  return (
    <button
      className={`relative border rounded-3xl p-6 text-left ${
        active ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      {active && (
        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <Check size={14} />
        </div>
      )}

      <h3 className="font-black text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{desc}</p>
    </button>
  );
}

export default Settings;