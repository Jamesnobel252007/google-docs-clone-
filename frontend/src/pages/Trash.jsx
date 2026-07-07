import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/api";

function Trash() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
      const [search, setSearch] = useState("");
      
    const fetchTrash = async () => {
        try {
            setLoading(true);

            // backend preferred
            const { data } = await api.get("documents/?filter=trash");

            setDocs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadTrash = async () => {
            try {
                setLoading(true);

                const { data } = await api.get("documents/?filter=trash");
                setDocs(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTrash();
    }, []);

    const restore = async (id) => {
        try {
            await api.patch(`documents/${id}/`, {
                is_trashed: false
            });

            fetchTrash();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteForever = async (id) => {
        try {
            await api.delete(`documents/${id}/`);
            fetchTrash();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex bg-[#F9FBFD]">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header
    search={search}
    setSearch={setSearch}
/>

                <main className="p-8 max-w-7xl mx-auto w-full">
                    <h1 className="text-3xl font-bold mb-4">Trash</h1>

                    {docs.length === 0 ? (
                        <p>No trashed documents</p>
                    ) : (
                        docs.map(doc => (
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