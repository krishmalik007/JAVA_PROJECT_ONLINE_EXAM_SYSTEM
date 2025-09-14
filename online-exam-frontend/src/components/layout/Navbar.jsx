import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 
                 flex justify-between items-center px-8 py-3 rounded-xl mx-6 my-4"
    >
      <h1 className="text-xl font-semibold text-white">Online Exam System</h1>
      <button
        onClick={logout}
        className="bg-white/20 px-4 py-2 rounded-lg text-white hover:bg-white/30 transition"
      >
        Logout
      </button>
    </motion.nav>
  );
}