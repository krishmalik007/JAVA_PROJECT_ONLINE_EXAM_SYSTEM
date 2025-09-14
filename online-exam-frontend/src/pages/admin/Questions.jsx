import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { adminApi } from "../../api/api";
import { useAuth } from "../../components/AuthContext";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit } from "lucide-react";

export default function Questions() {
  const { role } = useAuth();
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [form, setForm] = useState({
    text: "",
    options: ["", "", ""],
    answer: "",
    examId: examId || "",
  });

  const fetchQuestions = async (id) => {
    try {
      let questionsResponse;
      if (id) {
        questionsResponse = await adminApi.get(`/admin/exams/${id}/questions`);
      } else {
        questionsResponse = await adminApi.get("/admin/questions");
      }
      setQuestions(questionsResponse.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  const fetchExamDetails = async (id) => {
    try {
      const examResponse = await adminApi.get(`/admin/exams/${id}`);
      setExam(examResponse.data);
    } catch (error) {
      console.error("Failed to fetch exam details", error);
    }
  };

  useEffect(() => {
    fetchQuestions(examId);
    if (examId) fetchExamDetails(examId);
  }, [examId]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post("/admin/questions", {
        text: form.text,
        options: form.options,
        answer: form.answer,
        exam: { id: parseInt(form.examId) },
      });
      fetchQuestions(examId);
      resetForm();
    } catch (error) {
      console.error("Failed to create question", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.put(`/admin/questions/${currentQuestion.id}`, {
        text: form.text,
        options: form.options,
        answer: form.answer,
        exam: { id: parseInt(form.examId) },
      });
      fetchQuestions(examId);
      resetForm();
    } catch (error) {
      console.error("Failed to update question", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await adminApi.delete(`/admin/questions/${id}`);
        fetchQuestions(examId);
      } catch (error) {
        console.error("Failed to delete question", error);
      }
    }
  };

  const resetForm = () => {
    setForm({
      text: "",
      options: ["", "", ""],
      answer: "",
      examId: examId || "",
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentQuestion(null);
  };

  const openEditModal = (question) => {
    setIsEditMode(true);
    setCurrentQuestion(question);
    setForm({
      text: question.text,
      options: question.options || ["", "", ""],
      answer: question.answer,
      examId: question.exam?.id || "",
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
            <h2 className="text-3xl font-bold mb-6">Questions</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setIsEditMode(false);
                setForm({ text: "", options: ["", "", ""], answer: "", examId: examId || "" });
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Add Question
            </motion.button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Question List</h3>
            <ul className="space-y-4">
              {questions.length > 0 ? (
                questions.map((q, index) => (
                  <li key={q.id} className="p-4 bg-white/10 rounded-lg flex justify-between items-start">
                    <div>
                      <p className="font-bold">
                        Q{index + 1}: {q.text}
                        
                      </p>
                      <ul className="list-disc list-inside mt-2 text-sm">
                        {(q.options || []).map((option, i) => (
                          <li key={i} className={q.answer === option ? "text-green-400" : ""}>
                            {option} {q.answer === option && "(Correct)"}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => openEditModal(q)}
                        className="text-blue-400 hover:text-blue-300 transition"
                      >
                        <Edit size={20} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDelete(q.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No questions found.</p>
              )}
            </ul>
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
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl w-full max-w-lg text-white"
            >
              <h3 className="text-2xl font-bold mb-4">
                {isEditMode
                  ? `Edit Question for Exam ID: ${form.examId}`
                  : `Add New Question for Exam ID: ${form.examId || "Unassigned"}`}
              </h3>
              <form onSubmit={isEditMode ? handleEditSubmit : handleCreateSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Question Text</label>
                  <textarea
                    name="text"
                    value={form.text}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded-lg bg-white/20"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Options (3)</label>
                  {form.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-full p-2 mb-2 rounded-lg bg-white/20"
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Correct Answer</label>
                  <select
                    name="answer"
                    value={form.answer}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded-lg bg-white/20"
                    required
                  >
                    <option value="">Select Correct Answer</option>
                    {form.options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                {!examId && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Exam ID</label>
                    <input
                      type="text"
                      name="examId"
                      value={form.examId}
                      onChange={handleFormChange}
                      className="w-full p-2 rounded-lg bg-white/20"
                      placeholder="Enter Exam ID"
                      required
                    />
                  </div>
                )}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition"
                  >
                    {isEditMode ? "Save Changes" : "Create Question"}
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
