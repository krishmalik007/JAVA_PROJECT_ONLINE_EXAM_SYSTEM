import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { adminApi } from "../../api/api";
import { useAuth } from "../../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Edit } from "lucide-react";

export default function Exams() {
  const { role } = useAuth();
  const [exams, setExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", durationMinutes: "" });
  const [error, setError] = useState(null);

  const fetchExams = async () => {
    try {
      const response = await adminApi.get("/admin/exams");
      setExams(response.data);
    } catch (error) {
      console.error("Failed to fetch exams", error);
      setError("Failed to load exams. Please try again.");
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ title: "", description: "", durationMinutes: "" });
    setError(null);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post("/admin/exams", {
        ...form,
        durationMinutes: Number(form.durationMinutes),
      });
      fetchExams();
      closeModal();
    } catch (error) {
      console.error("Failed to create exam", error);
      setError("Failed to create exam.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.put(`/admin/exams/${currentExam.id}`, {
        ...form,
        durationMinutes: Number(form.durationMinutes),
      });
      fetchExams();
      closeModal();
      setIsEditMode(false);
      setCurrentExam(null);
    } catch (error) {
      console.error("Failed to update exam", error);
      setError("Failed to update exam.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await adminApi.delete(`/admin/exams/${id}`);
        fetchExams();
      } catch (error) {
        console.error("Failed to delete exam", error);
        setError("Failed to delete exam.");
      }
    }
  };

  const openEditModal = (exam) => {
    setIsEditMode(true);
    setCurrentExam(exam);
    setForm({
      title: exam.title,
      description: exam.description,
      durationMinutes: exam.durationMinutes,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex bg-gradient-to-tr from-gray-900 via-gray-800 to-black min-h-screen text-white">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Manage Exams</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setIsEditMode(false);
                setForm({ title: "", description: "", durationMinutes: "" });
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Add Exam
            </motion.button>
          </div>
          
          {error && (
            <div className="bg-red-600 text-white p-2 rounded mb-4">{error}</div>
          )}

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Exam List</h3>
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration (min)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-400">
                      No exams found. Create one!
                    </td>
                  </tr>
                ) : (
                  exams.map((exam) => (
                    <tr key={exam.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{exam.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{exam.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{exam.durationMinutes}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                        <Link
                          to={`/admin/questions/${exam.id}`}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg transition"
                        >
                          View Questions
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => openEditModal(exam)}
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          <Edit size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDelete(exam.id)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl w-96 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">{isEditMode ? "Edit Exam" : "Add New Exam"}</h3>
              {error && (
                <div className="bg-red-600 text-white p-2 rounded mb-4">{error}</div>
              )}
              <form onSubmit={isEditMode ? handleEditSubmit : handleCreateSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded-lg bg-white/20"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded-lg bg-white/20"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={form.durationMinutes}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded-lg bg-white/20"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition"
                  >
                    {isEditMode ? "Save Changes" : "Create Exam"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}