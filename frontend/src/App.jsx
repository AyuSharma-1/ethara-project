import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";

const App = () => {
  return (
    <AuthProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-white text-zinc-900">
        <Navbar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
            </Route>
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
