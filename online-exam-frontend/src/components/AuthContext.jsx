import { createContext, useContext, useState, useEffect } from "react";
import { userApi, adminApi } from "../api/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const login = async (username, password, selectedRole) => {
    const api = selectedRole === "ADMIN" ? adminApi : userApi;
    try {
      const response = await api.post("/auth/login", { username, password, role: selectedRole }); // Pass the selected role to the backend
      const newToken = response.data.token;
      setToken(newToken);
      setRole(selectedRole);
      localStorage.setItem("token", newToken);
      localStorage.setItem("role", selectedRole);
      
      if (selectedRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error); 
      throw new Error(error.response?.data?.message || "Login failed"); 
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.clear();
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, setToken, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);