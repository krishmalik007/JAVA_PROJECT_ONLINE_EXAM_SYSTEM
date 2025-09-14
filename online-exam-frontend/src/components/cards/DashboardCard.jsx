// src/components/cards/DashboardCard.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function DashboardCard({ title, value, icon: Icon, path }) {
  return (
    <Link to={path}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 
                   shadow-lg text-white flex items-center gap-4 transition cursor-pointer"
      >
        <div className="bg-white/20 p-3 rounded-xl">
          <Icon size={28} />
        </div>
        <div>
          <p className="text-lg">{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>
      </motion.div>
    </Link>
  );
}