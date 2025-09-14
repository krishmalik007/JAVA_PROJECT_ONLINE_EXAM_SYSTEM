**Online Exam System Frontend**
A React application with Vite and Tailwind CSS that serves as the user and admin interface for the Online Exam System backend.

**Features**
**User Authentication:** A login page with role selection (Admin/User) and a registration page for new users.

**Admin Dashboard:**

Dashboard cards display real-time counts for Exams, Questions, and Users.

A "Manage Exams" page with a table to create, update, and delete exams.

A "Manage Questions" page to add, edit, and delete questions for a specific exam.

A "View All Results" page to see the submitted scores of all users.

**Student Dashboard:**

Dashboard cards display the number of available and completed exams.

A "Take Exam" page that lists available exams for the student.

A "Start Exam" page where the student can answer questions and submit their attempt.

A "Results" page to view their personal exam history and scores.

**Persistence:** The frontend connects to a shared MySQL database via two Spring Boot backend services.

Getting Started
Prerequisites
Node.js and npm

**Backend services (admin-service and user-service) running on ports 8081 and 8082, respectively.**

**Setup**
**Clone or create the React project:**

**Bash**

npm create vite@latest online-exam-frontend
cd online-exam-frontend
Install dependencies:

**Bash**

npm install react-router-dom axios framer-motion lucide-react tailwindcss postcss autoprefixer
Configure Tailwind CSS:

**Bash**

npx tailwindcss init -p
Update tailwind.config.js and src/index.css as previously instructed.

**Project Structure**
Your frontend project is structured to separate components, pages, and API logic.

online-exam-frontend/
├── src/
│    ├── api/
│    │    └── api.js              # Centralized Axios configuration
│    ├── components/
│    │    ├── cards/
│    │    │    └── DashboardCard.jsx
│    │    ├── layout/
│    │    │    ├── Navbar.jsx
│    │    │    └── Sidebar.jsx
│    │    ├── AuthContext.jsx      # Manages authentication state
│    │    └── ProtectedRoute.jsx   # Guards private routes
│    ├── pages/
│    │    ├── admin/
│    │    │    ├── AdminDashboard.jsx
│    │    │    ├── Exams.jsx
│    │    │    ├── Questions.jsx
│    │    │    ├── Results.jsx
│    │    │    └── Users.jsx
│    │    ├── user/
│    │    │    ├── UserDashboard.jsx
│    │    │    ├── TakeExam.jsx
│    │    │    ├── StartExam.jsx
│    │    │    └── Results.jsx
│    │    ├── Login.jsx
│    │    └── Register.jsx
│    ├── router.jsx
│    └── main.jsx
├── tailwind.config.js
└── package.json
**API Endpoints & Usage**
The frontend uses two Axios instances, adminApi (port 8081) and userApi (port 8082), which automatically attach the JWT token to requests.

**Authentication & Registration**
Login.jsx: Makes a POST request to userApi.post('/auth/login', ...) or adminApi.post('/auth/login', ...) based on the selected role.

Register.jsx: Makes a POST request to userApi.post('/auth/register', ...) to create a new user account.

**Admin Panel Endpoints
AdminDashboard.jsx:**

GET /api/admin/exams (to count total exams)

GET /api/admin/questions (to count all questions)

GET /api/admin/users (to count all users)

**Exams.jsx:**

GET /api/admin/exams (to list all exams)

POST /api/admin/exams (to add a new exam)

PUT /api/admin/exams/{id} (to update an exam)

DELETE /api/admin/exams/{id} (to delete an exam)

PUT /api/admin/exams/{id}/status (to start/stop an exam)

**Questions.jsx:**

GET /api/admin/exams/{examId}/questions (to list questions for an exam)

POST /api/admin/questions (to add a new question)

PUT /api/admin/questions/{id} (to update a question)

DELETE /api/admin/questions/{id} (to delete a question)

**Results.jsx:**

GET /api/admin/results/all (to list all exam results)

Student Panel Endpoints
**UserDashboard.jsx:**

GET /api/user/exams (to count available exams)

GET /api/user/results (to count completed exams)

**TakeExam.jsx:**

GET /api/user/exams (to list all exams available to the user)

**StartExam.jsx:**

GET /api/user/exams/{examId}/questions (to get questions for the exam)

POST /api/user/submit-exam (to submit the user's answers)

**Results.jsx (User):**

GET /api/user/results (to view the user's personal results history)

Usage
**To run the full application:**

Ensure your backend admin-service and user-service are running in separate terminals.

In a third terminal, navigate to your online-exam-frontend directory and run npm run dev.

Open the URL displayed in the terminal to view your working application.
