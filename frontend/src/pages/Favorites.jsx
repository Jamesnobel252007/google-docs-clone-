import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/api";
import { FileText, Star } from "lucide-react";

function Favorites() {
    const [favoriteDocs, setFavoriteDocs] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const { data } = await api.get("documents/");
            const flags = JSON.parse(localStorage.getItem("docFlags")) || {};

            const favorites = data.filter(
                (doc) =>
                    flags[doc.id]?.is_favorite === true &&
                    flags[doc.id]?.is_trashed !== true
            );

            setFavoriteDocs(favorites);
        } catch (error) {
            console.error(error);
        }
    };

    const removeFavorite = (id) => {
        const flags = JSON.parse(localStorage.getItem("docFlags")) || {};

        flags[id] = {
            ...flags[id],
            is_favorite: false,
        };

        localStorage.setItem("docFlags", JSON.stringify(flags));

        setFavoriteDocs((prev) => prev.filter((doc) => doc.id !== id));
    };

    const filteredFavorites = favoriteDocs.filter((doc) =>
        doc.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F9FBFD] flex">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header search={search} setSearch={setSearch} />

                <main className="p-8 max-w-7xl w-full mx-auto">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Favorites
                    </h1>

                    <p className="text-slate-500 mb-6">
                        {filteredFavorites.length} starred documents
                    </p>

                    {filteredFavorites.length === 0 ? (
                        <div className="bg-white p-10 rounded-2xl shadow-sm border text-center">
                            <Star className="mx-auto text-slate-300 mb-3" size={30} />
                            <h2 className="text-xl font-bold">No favorite documents</h2>
                            <p className="text-slate-500 mt-2">
                                Add documents to favorites from Documents page.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredFavorites.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => navigate(`/editor/${doc.id}`)}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition cursor-pointer"
                                >
                                    <div className="h-11 w-11 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500 mb-4">
                                        <FileText size={20} />
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900">
                                        {doc.title}
                                    </h3>

                                    <p className="text-sm text-slate-400 mt-2">
                                        Updated {new Date(doc.updated_at).toLocaleString()}
                                    </p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFavorite(doc.id);
                                        }}
                                        className="mt-5 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-xl text-sm font-bold"
                                    >
                                        Remove Favorite
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Favorites;