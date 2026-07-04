import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/api";

function Trash() {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        fetchTrash();
    }, []);

    const fetchTrash = async () => {
        const { data } = await api.get("documents/");
        setDocs(data);
    };

    const restore = async (id) => {
        await api.patch(`documents/${id}/`, {
            is_trashed: false
        });

        fetchTrash();
    };

    const deleteForever = async (id) => {
        await api.delete(`documents/${id}/`);
        fetchTrash();
    };

    const trashDocs = docs.filter(d => d.is_trashed);

    return (
        <div className="min-h-screen flex bg-[#F9FBFD]">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8 max-w-7xl mx-auto w-full">

                    <h1 className="text-3xl font-bold mb-4">Trash</h1>

                    {trashDocs.length === 0 ? (
                        <p>No trashed documents</p>
                    ) : (
                        trashDocs.map(doc => (
                            <div key={doc.id} className="bg-white p-4 border rounded mb-3">

                                <h3>{doc.title}</h3>

                                <button onClick={() => restore(doc.id)}>
                                    Restore
                                </button>

                                <button onClick={() => deleteForever(doc.id)}>
                                    Delete Forever
                                </button>

                            </div>
                        ))
                    )}

                </main>
            </div>
        </div>
    );
}

export default Trash;