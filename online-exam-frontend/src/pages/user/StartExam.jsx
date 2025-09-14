import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { userApi } from "../../api/api";
import { useAuth } from "../../components/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function StartExam() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { examId } = useParams();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // ⏳ Timer state

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        // ✅ Fetch all exams first
        const examsResponse = await userApi.get("/user/exams");
        const selectedExam = examsResponse.data.find(
          (e) => e.id === parseInt(examId)
        );
        setExam(selectedExam);

        if (selectedExam) {
          // set timer in seconds
          setTimeLeft(selectedExam.durationMinutes * 60);
        }

        // ✅ Fetch only the questions for this exam
        const questionsResponse = await userApi.get(
          `/user/exams/${examId}/questions`
        );
        setQuestions(questionsResponse.data);
      } catch (error) {
        console.error("Failed to fetch exam/questions", error);
        alert("Failed to load exam. Please try again.");
        navigate("/user/take-exam");
      }
    };

    if (examId) {
      fetchExamDetails();
    }
  }, [examId, navigate]);

  // ⏳ Timer countdown effect
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft === 0 && !isSubmitted) {
      handleSubmit(); // auto-submit when time is up
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    try {
      await userApi.post("/user/submit-exam", {
        examId: exam.id,
        answers: answers,
      });
      setIsSubmitted(true);
      alert("Exam submitted successfully!");
      navigate("/user/results");
    } catch (error) {
      console.error("Failed to submit exam", error);
      alert("Failed to submit exam. Please try again.");
    }
  };

  if (!exam) {
    return (
      <div className="flex bg-gradient-to-tr from-purple-900 via-indigo-800 to-blue-900 min-h-screen text-white">
        <Sidebar role={role} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold">Loading Exam...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-tr from-purple-900 via-indigo-800 to-blue-900 min-h-screen text-white">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Exam: {exam.title}</h2>
            {/* ⏳ Timer display */}
            <div className="bg-red-600 px-4 py-2 rounded-lg font-bold text-lg">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Questions</h3>
            {questions.map((q) => (
              <div
                key={q.id}
                className="mb-4 p-4 border border-white/20 rounded-lg"
              >
                <p className="font-semibold mb-2">{q.text}</p>
                {q.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={() => handleAnswerChange(q.id, option)}
                      className="mr-2"
                    />
                    <label>{option}</label>
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-bold transition mt-4"
              disabled={isSubmitted}
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
