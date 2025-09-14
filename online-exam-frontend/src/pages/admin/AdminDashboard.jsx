import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import DashboardCard from "../../components/cards/DashboardCard";
import { FileText, ListChecks, UserCheck } from "lucide-react";
import { adminApi } from "../../api/api";
import { useAuth } from "../../components/AuthContext";

export default function AdminDashboard() {
  const { role } = useAuth();
  const [stats, setStats] = useState({ exams: 0, questions: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const examsResponse = await adminApi.get("/admin/exams");
        const questionsResponse = await adminApi.get("/admin/questions");
        const usersResponse = await adminApi.get("/admin/users");

        setStats({
          exams: examsResponse.data.length,
          questions: questionsResponse.data.length,
          users: usersResponse.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex bg-gradient-to-tr from-gray-900 via-gray-800 to-black min-h-screen text-white">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <DashboardCard
            title="Total Exams"
            value={stats.exams}
            icon={FileText}
            path="/admin/exams"
          />
          <DashboardCard
            title="Questions"
            value={stats.questions}
            icon={ListChecks}
            path="/admin/questions"
          />
          <DashboardCard
            title="Users Enrolled"
            value={stats.users}
            icon={UserCheck}
            path="/admin/users"
          />
        </div>
      </div>
    </div>
  );
}
