import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { adminApi } from "../../api/api";
import { useAuth } from "../../components/AuthContext";

export default function Users1() {
  const { role } = useAuth();
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminApi.get("/admin/users");
        
        // Filter users by role
        const studentUsers = response.data.filter(user => user.role === "USER");
        const adminUsers = response.data.filter(user => user.role === "ADMIN");

        setUsers(studentUsers);
        setAdmins(adminUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex bg-gradient-to-tr from-gray-900 via-gray-800 to-black min-h-screen text-white">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          {/* Section for Enrolled Users (Students) */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Enrolled Users</h2>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Student List</h3>
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section for Admin Users */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Admin Users</h2>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Admin List</h3>
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}