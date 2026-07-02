import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FileText, Share2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        firstName: "Sujay",
        lastName: "Bobby",
        email: "sujaybobby1@gmail.com",
        bio: "MERN Intern at VDart. B.Tech IT student building scalable collaborative systems and modern web applications.",
    });

    useEffect(() => {
        const savedProfile = JSON.parse(localStorage.getItem("vdocsProfile"));

        if (savedProfile) {
            setProfile(savedProfile);
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FBFD] flex">
            <Sidebar />

            <div className="flex-1">
                <Header search="" setSearch={() => { }} />

                <main className="p-8 max-w-7xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-6">
                                <div className="w-32 h-32 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-5xl font-black border-4 border-blue-500">
                                    {profile.firstName.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h1 className="text-5xl font-bold text-slate-900">
                                        {profile.firstName} {profile.lastName}
                                    </h1>

                                    <p className="text-slate-500 mt-2 text-lg">
                                        {profile.email}
                                    </p>

                                    <p className="mt-5 text-slate-600 max-w-3xl leading-8 text-lg">
                                        {profile.bio}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/settings")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-8">
                        <div className="bg-white p-8 rounded-3xl border">
                            <FileText className="text-blue-600 mb-4" size={28} />
                            <h2 className="text-5xl font-bold">12</h2>
                            <p className="text-slate-500 mt-2">Documents Created</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border">
                            <Share2 className="text-purple-600 mb-4" size={28} />
                            <h2 className="text-5xl font-bold">5</h2>
                            <p className="text-slate-500 mt-2">Shared Documents</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border">
                            <Users className="text-orange-600 mb-4" size={28} />
                            <h2 className="text-5xl font-bold">8</h2>
                            <p className="text-slate-500 mt-2">Collaborators</p>
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="mt-8">
                        <h2 className="text-3xl font-bold mb-5">Recent Activity</h2>

                        <div className="bg-white rounded-2xl border">
                            <div className="p-5 border-b">
                                <h3 className="font-bold text-lg">Project Notes.doc</h3>
                                <p className="text-slate-500">Edited 2 hours ago</p>
                            </div>

                            <div className="p-5">
                                <h3 className="font-bold text-lg">API Documentation</h3>
                                <p className="text-slate-500">Edited yesterday</p>
                            </div>
                        </div>
                    </div>

                    {/* Premium Card */}
                    <div className="mt-8 bg-blue-600 text-white rounded-3xl p-10 flex justify-between items-center">
                        <div>
                            <h2 className="text-4xl font-bold">Workspace Premium</h2>
                            <p className="mt-4 text-blue-100 text-lg max-w-2xl">
                                You are on premium plan with unlimited documents and advanced
                                collaboration tools.
                            </p>
                        </div>

                        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold">
                            Manage Plan
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;