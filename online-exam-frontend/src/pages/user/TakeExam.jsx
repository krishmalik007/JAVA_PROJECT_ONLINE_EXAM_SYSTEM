import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { userApi } from "../../api/api";
import { useAuth } from "../../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TakeExam() {
  const { role } = useAuth();
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await userApi.get("/user/exams");
        setExams(response.data);
      } catch (error) {
        console.error("Failed to fetch exams", error.response?.data || error.message);
      }
    };
    fetchExams();
  }, []);

  const handleExamClick = (examId) => {
    navigate(`/user/start-exam/${examId}`);
  };

  return (
    <div className="flex bg-gradient-to-tr from-purple-900 via-indigo-800 to-blue-900 min-h-screen text-white">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6">Take an Exam</h2>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Available Exams</h3>
            <div className="space-y-4">
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <motion.div
                    key={exam.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white/10 rounded-lg flex items-center justify-between"
                  >
                    {/* Exam Info (left side) */}
                    <div>
                      <h4 className="font-bold">{exam.title}</h4>
                      <p className="text-sm text-gray-300">{exam.description}</p>
                      <p className="text-xs text-gray-400">
                        Duration: {exam.durationMinutes} minutes
                      </p>
                    </div>

                    {/* Start Exam Button (right side) */}
                    <button
                      onClick={() => handleExamClick(exam.id)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold"
                    >
                      Start Exam
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400">No exams available at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
