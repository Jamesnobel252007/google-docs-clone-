import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/api";
import { FileText, Star } from "lucide-react";

function Favorites() {
    const [docs, setDocs] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        const { data } = await api.get("documents/");
        setDocs(data);
    };

    const toggleFavorite = async (id, value) => {
        await api.patch(`documents/${id}/`, {
            is_favorite: value
        });

        fetchFavorites();
    };

    const filtered = docs.filter(
        d =>
            d.is_favorite &&
            !d.is_trashed &&
            d.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen flex bg-[#F9FBFD]">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header search={search} setSearch={setSearch} />

                <main className="p-8 max-w-7xl mx-auto w-full">

                    <h1 className="text-3xl font-bold mb-2">Favorites</h1>
                    <p className="text-slate-500 mb-6">
                        {filtered.length} starred documents
                    </p>

                    {filtered.length === 0 ? (
                        <div className="text-center p-10 bg-white border rounded-xl">
                            <Star className="mx-auto text-slate-300" />
                            <h2>No favorites yet</h2>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-5">
                            {filtered.map(doc => (
                                <div
                                    key={doc.id}
                                    onClick={() => navigate(`/editor/${doc.id}`)}
                                    className="bg-white p-5 border rounded-xl cursor-pointer"
                                >
                                    <FileText />
                                    <h3>{doc.title}</h3>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(doc.id, false);
                                        }}
                                        className="mt-3 text-sm text-yellow-600"
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