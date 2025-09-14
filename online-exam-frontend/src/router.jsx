import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Exams from "./pages/admin/Exams";
import Questions from "./pages/admin/Questions";
import Users1 from "./pages/admin/Users1.jsx";
import UserDashboard from "./pages/user/UserDashboard";
import TakeExam from "./pages/user/TakeExam";
import Results from "./pages/user/Results";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized.jsx";
import StartExam from "./pages/user/StartExam.jsx";
import Results1 from "./pages/admin/Results1.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/exams" element={<Exams />} />
  
        <Route path="/admin/questions" element={<Questions />} />
        <Route path="/admin/questions/:examId" element={<Questions />} />
        <Route path="/admin/users" element={<Users1 />} />
        <Route path="/admin/results" element={<Results1 />} /> 
      </Route>

      {/* User routes */}
      <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/take-exam" element={<TakeExam />} />
        <Route path="/user/start-exam/:examId" element={<StartExam />} />
        <Route path="/user/results" element={<Results />} />
      </Route>

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}
