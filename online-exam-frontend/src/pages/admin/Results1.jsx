import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { adminApi } from "../../api/api";
import { useAuth } from "../../components/AuthContext";

export default function Results1() {
  const { role } = useAuth();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await adminApi.get("/admin/results/all");
        setResults(response.data);
      } catch (error) {
        console.error("Failed to fetch all results", error);
        setError("Failed to fetch results. Please try again.");
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="flex bg-gradient-to-tr from-gray-900 via-gray-800 to-black min-h-screen text-white">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">All User Results</h2>
          </div>
          {error && (
            <div className="bg-red-600 text-white p-2 rounded mb-4">{error}</div>
          )}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Result List</h3>
            {results.length === 0 ? (
              <p className="text-gray-400">No results found.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Exam Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {results.map((result) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{result.user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.exam.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.score} / {result.totalQuestions}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(result.submissionDate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}