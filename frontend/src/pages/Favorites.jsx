import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FileText } from "lucide-react";
import Header from "../components/Header";

function Favorites() {
    const [favoriteDocs, setFavoriteDocs] = useState([]);

    useEffect(() => {
        const documents =
            JSON.parse(localStorage.getItem("documents-list")) || [];

        const flags =
            JSON.parse(localStorage.getItem("docFlags")) || {};

        const favorites = documents.filter(
            (doc) => flags[doc.id]?.is_favorite === true
        );

        setFavoriteDocs(favorites);
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FBFD] flex">
            <Sidebar />

            <div className="flex-1 p-8">
                <Header/>
                
                <h1 className="text-3xl font-bold mb-2">Favorites</h1>
                <p className="text-slate-500 mb-6">Your starred documents</p>

                {favoriteDocs.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow text-center">
                        <h2 className="text-xl font-bold">No favorite documents</h2>
                        <p className="text-slate-500 mt-2">
                            Add documents to favorites from Documents page
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-5">
                        {favoriteDocs.map((doc) => (
                            <div
                                key={doc.id}
                                className="bg-white rounded-2xl p-6 shadow border"
                            >
                                <div className="h-11 w-11 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500 mb-4">
                                    <FileText size={20} />
                                </div>

                                <h3 className="font-bold text-lg">{doc.title}</h3>

                                <p className="text-sm text-slate-400 mt-2">
                                    ⭐ Favorite Document
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Favorites;