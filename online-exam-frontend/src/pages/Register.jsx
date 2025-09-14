import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { userApi } from "../api/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await userApi.post("/auth/register", { username, email, password });
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-purple-900 via-indigo-800 to-blue-900 text-white">
      <motion.form
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleRegister}
        className="bg-white/10 backdrop-blur-md border border-white/20 
                   shadow-xl rounded-2xl p-6 w-96 text-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-3 border rounded bg-white/20 text-white placeholder-gray-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded bg-white/20 text-white placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded bg-white/20 text-white placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition"
        >
          Register
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-300 hover:underline">Log in</Link>
        </p>
      </motion.form>
    </div>
  );
}