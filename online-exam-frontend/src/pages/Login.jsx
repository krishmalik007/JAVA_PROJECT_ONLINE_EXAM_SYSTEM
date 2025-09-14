import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password, role);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white">
      <motion.form
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-md border border-white/20 
                   shadow-xl rounded-2xl p-6 w-96 text-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-3 border rounded bg-white/20 text-white placeholder-gray-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded bg-white/20 text-white placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="w-full p-2 mb-3 border rounded bg-white/20 text-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition"
        >
          Login
        </button>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/register" className="text-blue-300 hover:underline">Sign up</Link>
        </p>
      </motion.form>
    </div>
  );
}