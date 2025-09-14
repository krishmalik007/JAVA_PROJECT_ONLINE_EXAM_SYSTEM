import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import DashboardCard from "../../components/cards/DashboardCard";
import { FileText, UserCheck } from "lucide-react";
import { userApi } from "../../api/api";
import { useAuth } from "../../components/AuthContext";

export default function UserDashboard() {
  const { role } = useAuth();
  const [stats, setStats] = useState({ availableExams: 0, completedExams: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const examsResponse = await userApi.get("/user/exams");
        const resultsResponse = await userApi.get("/user/results");

        setStats({
          availableExams: examsResponse.data.length,
          completedExams: resultsResponse.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch user stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex bg-gradient-to-tr from-purple-900 via-indigo-800 to-blue-900 min-h-screen text-white">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <DashboardCard title="Available Exams" value={stats.availableExams} icon={FileText} path="/user/take-exam" />
          <DashboardCard title="Total Attempts" value={stats.completedExams} icon={UserCheck} path="/user/results" />
        </div>
      </div>
    </div>
  );
}