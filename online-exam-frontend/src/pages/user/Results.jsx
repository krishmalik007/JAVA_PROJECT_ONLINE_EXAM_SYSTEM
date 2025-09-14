import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { userApi } from "../../api/api";
import { useAuth } from "../../components/AuthContext";

export default function Results() {
  const { role } = useAuth();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await userApi.get("/user/results");
        setResults(response.data);
      } catch (err) {
        console.error("Failed to fetch results", err);
        if (err.response?.status === 403) {
          setError("You are not authorized. Please log in again.");
        } else {
          setError("Failed to fetch results. Please try again later.");
        }
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="flex bg-gradient-to-tr from-purple-900 via-indigo-800 to-blue-900 min-h-screen text-white">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6">Your Exam Results</h2>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Result History</h3>

            {error && (
              <div className="bg-red-600 text-white p-2 rounded mb-4">{error}</div>
            )}

            {results.length === 0 && !error ? (
              <p className="text-gray-400">No results found.</p>
            ) : (
              <ul>
                {results.map((result) => (
                  <li key={result.id} className="p-3 mb-2 bg-white/10 rounded-lg">
                    <p className="font-semibold">{result.exam.title}</p>
                    <p>Score: {result.score} / {result.totalQuestions}</p>
                    <p className="text-sm text-gray-400">
                      Date: {new Date(result.submissionDate).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
