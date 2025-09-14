import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-tr from-gray-900 via-gray-800 to-black"
    >
      <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="text-lg text-center mb-6">
        You do not have permission to view this page.
      </p>
      <Link
        to="/login"
        className="bg-white/20 px-6 py-2 rounded-lg hover:bg-white/30 transition"
      >
        Go to Login
      </Link>
    </motion.div>
  );
}