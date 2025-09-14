import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LayoutDashboard, FileText, ListChecks, UserCheck, BarChart2 } from "lucide-react";

export default function Sidebar({ role = "USER" }) {
  const adminLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Exams", icon: FileText, path: "/admin/exams" },
    { name: "Questions", icon: ListChecks, path: "/admin/questions" },
    { name: "Users Enrolled", icon: UserCheck, path: "/admin/users" },
    { name: "All Results", icon: BarChart2, path: "/admin/results" },
  ];

  const userLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/user/dashboard" },
    { name: "Take Exam", icon: FileText, path: "/user/take-exam" },
    { name: "Results", icon: UserCheck, path: "/user/results" },
  ];

  const links = role === "ADMIN" ? adminLinks : userLinks;

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-64 min-h-screen p-6 shadow-xl bg-gradient-to-b ${
        role === "ADMIN"
          ? "from-gray-900 via-gray-800 to-gray-900"
          : "from-purple-900 via-indigo-800 to-blue-900"
      } text-white`}
    >
      <h2 className="text-2xl font-extrabold mb-8">{role} Panel</h2>
      <nav className="flex flex-col gap-3">
        {links.map(({ name, icon: Icon, path }) => (
          <Link
            key={name}
            to={path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition"
          >
            <Icon size={20} /> {name}
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}