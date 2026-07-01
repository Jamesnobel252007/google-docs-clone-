import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Trash() {
    return (
        <div className="min-h-screen bg-[#F9FBFD] flex">
            <Sidebar />

            <div className="flex-1 p-8">

                <Header/>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Trash
                </h1>

                <p className="text-slate-500">
                    Deleted documents will appear here.
                </p>
            </div>
        </div>
    );
}

export default Trash;