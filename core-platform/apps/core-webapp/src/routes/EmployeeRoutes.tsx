import { Route } from "react-router-dom";

// Dashboard
import { EmployeeHome } from "../pages/dashboard";

// Profile
import { MyProfile } from "../pages/profile";

// Projects
import { MyProjects, ProjectDetails, AddProject } from "../pages/projects";

// Tasks
import { EmployeeTasks, TaskDetails as TaskDetail, TodoManagement } from "../pages/tasks";

// Time Tracking
import { EmployeeTimeTracking } from "../pages/time-tracking";

// Teams
import { MyTeam } from "../pages/teams";

// Documents
import { Documents, DocumentDetail } from "../pages/documents";

// Messages
import { Messages } from "../pages/messages";

// Calendar
import { Calendar } from "../pages/calendar";

// Leave
import { LeaveRequests } from "../pages/leave";

// Performance
import { PerformanceReviews, PerformanceReviewDetails } from "../pages/performance";

// Payroll
import { EmployeePayroll } from "../pages/payroll";

// Training
import { TrainingDevelopment } from "../pages/training";

// Announcements
import { Announcements, AnnouncementDetails } from "../pages/announcements";

// Notifications
import { NotificationsCenter } from "../pages/notifications";

// Settings
import { Settings } from "../pages/settings";

// Bugs
import BugList from "../pages/bugs/BugList";
import BugDetails from "../pages/bugs/BugDetails";

// Todos
import TodoList from "../pages/todos/TodoList";

// Careers
import AvailableJobs from "../pages/careers/AvailableJobs";
import JobDetails from "../pages/careers/JobDetails";

/**
 * Employee Routes Component
 * All routes under /e prefix for employee users
 */
const EmployeeRoutes = () => {
    return (
        <>
            {/* Dashboard */}
            <Route index element={<EmployeeHome />} />
            <Route path="dashboard" element={<EmployeeHome />} />

            {/* Profile */}
            <Route path="profile" element={<MyProfile />} />

            {/* Projects */}
            <Route path="projects" element={<MyProjects />} />
            <Route path="projects/add" element={<AddProject />} />
            <Route path="projects/:id" element={<ProjectDetails />} />

            {/* Tasks */}
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="task-detail/:id" element={<TaskDetail />} />

            {/* Todos */}
            <Route path="todos" element={<TodoManagement />} />
            <Route path="my-todos" element={<TodoList />} />

            {/* Time Tracking */}
            <Route path="timesheet" element={<EmployeeTimeTracking />} />
            <Route path="time-tracking" element={<EmployeeTimeTracking />} />

            {/* Team */}
            <Route path="team" element={<MyTeam />} />

            {/* Documents */}
            <Route path="documents" element={<Documents />} />
            <Route path="documents/:id" element={<DocumentDetail />} />

            {/* Messages */}
            <Route path="messages" element={<Messages />} />

            {/* Calendar */}
            <Route path="calendar" element={<Calendar />} />

            {/* Leave */}
            <Route path="leave" element={<LeaveRequests />} />

            {/* Performance */}
            <Route path="performance" element={<PerformanceReviews />} />
            <Route path="performance/:id" element={<PerformanceReviewDetails />} />

            {/* Payroll */}
            <Route path="payroll" element={<EmployeePayroll />} />

            {/* Training */}
            <Route path="training" element={<TrainingDevelopment />} />

            {/* Announcements */}
            <Route path="announcements" element={<Announcements />} />
            <Route path="announcements/:id" element={<AnnouncementDetails />} />

            {/* Notifications */}
            <Route path="notifications" element={<NotificationsCenter />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />

            {/* Bugs */}
            <Route path="bugs" element={<BugList />} />
            <Route path="bugs/:id" element={<BugDetails />} />

            {/* Careers */}
            <Route path="careers" element={<AvailableJobs />} />
            <Route path="careers/:id" element={<JobDetails />} />
        </>
    );
};

export default EmployeeRoutes;
