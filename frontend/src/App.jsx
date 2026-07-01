import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Documents from "./pages/Documents";
import Shared from "./pages/Shared";
import Favorites from "./pages/Favorites";
import Trash from "./pages/Trash";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/shared" element={<Shared />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;