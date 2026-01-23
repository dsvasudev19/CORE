import { Route } from "react-router-dom";

// Dashboard
import { Dashboard } from "../pages/dashboard";

// Employees
import {
    EmployeeList,
    EmployeeDetails,
    AddOrEditEmployee as EmployeeModalDemo,
    EmployeeOnboarding
} from "../pages/employees";

// Teams
import { TeamManagement } from "../pages/teams";

// Projects
import { MyProjects, ProjectDetails, AddProject } from "../pages/projects";

// Documents
import { Documents, DocumentDetail } from "../pages/documents";

// Calendar
import { Calendar } from "../pages/calendar";

// Messages
import { Messages } from "../pages/messages";

// Attendance
import { AttendanceDashboard } from "../pages/attendance";

// Payroll
import { PayrollManagement } from "../pages/payroll";

// Performance
import { PerformanceReviews, PerformanceReviewDetails } from "../pages/performance";

// Reports
import { ReportsAnalytics } from "../pages/reports";

// Recruitment
import RecruitmentDashboard from "../pages/recruitment/RecruitmentDashboard";
import JobPostingList from "../pages/recruitment/JobPostingList";
import CandidateList from "../pages/recruitment/CandidateList";
import { JobDetails } from "../pages/recruitment";

// Training
import { TrainingDevelopment } from "../pages/training";

// Announcements
import { Announcements, AnnouncementView } from "../pages/announcements";
import CreateAnnouncement from "../pages/announcements/CreateAnnouncement";
import EditAnnouncement from "../pages/announcements/EditAnnouncement";

// Notifications
import { NotificationsCenter } from "../pages/notifications";

// Settings
import { Settings } from "../pages/settings";

// Access Control
import { AccessControl } from "../pages/access-control";

// Sprint Planning
import AdvancedMiroBoard from "../pages/sprint-planning/SprintPlanning";
import EpicManagement from "../pages/sprint-planning/EpicManagement";
import SprintManagement from "../pages/sprint-planning/SprintManagement";

// Client Management
import ClientListingPage from "../pages/client-management/ClientManagement";
import ClientDetailsPage from "../pages/client-management/ClientDetails";
import ClientAddPage from "../pages/client-management/AddClient";

// Departments & Designations
import DepartmentList from "../pages/departments/DepartmentList";
import DesignationList from "../pages/designations/DesignationList";

// Organization Settings
import OrganizationSettings from "../pages/organization-settings/OrganizationSettings";

// Admin Pages
import AdminProjectsOverview from "../pages/admin/AdminProjectsOverview";
import AdminTimeTrackingOverview from "../pages/admin/AdminTimeTrackingOverview";

// Payroll
// Bugs
import BugList from "../pages/bugs/BugList";

// Todos
import TodoList from "../pages/todos/TodoList";

// Audit Logs
import AuditLogList from "../pages/audit-logs/AuditLogList";

/**
 * Admin Routes Component
 * All routes under /a prefix for admin users
 */
const AdminRoutes = () => {
    return (
        <>
            {/* Dashboard */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Employees Management */}
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/details" element={<EmployeeDetails />} />
            <Route path="employees/add" element={<EmployeeModalDemo />} />
            <Route path="employees/edit" element={<EmployeeModalDemo />} />
            <Route path="employees/onboarding" element={<EmployeeOnboarding />} />

            {/* Teams */}
            <Route path="teams" element={<TeamManagement />} />

            {/* Payroll */}
            <Route path="payroll" element={<PayrollManagement />} />

            {/* Attendance */}
            <Route path="attendance" element={<AttendanceDashboard />} />

            {/* Performance */}
            <Route path="performance" element={<PerformanceReviews />} />
            <Route path="performance/:id" element={<PerformanceReviewDetails />} />

            {/* Reports */}
            <Route path="reports" element={<ReportsAnalytics />} />

            {/* Training */}
            <Route path="training" element={<TrainingDevelopment />} />

            {/* Recruitment */}
            <Route path="recruitment" element={<RecruitmentDashboard />} />
            <Route path="recruitment/jobs" element={<JobPostingList />} />
            <Route path="recruitment/candidates" element={<CandidateList />} />
            <Route path="recruitment/job/:id" element={<JobDetails />} />

            {/* Announcements */}
            <Route path="announcements" element={<Announcements />} />
            <Route path="announcements/create" element={<CreateAnnouncement />} />
            <Route path="announcements/edit/:id" element={<EditAnnouncement />} />
            <Route path="announcements/:id" element={<AnnouncementView />} />

            {/* Notifications */}
            <Route path="notifications" element={<NotificationsCenter />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />

            {/* Access Control */}
            <Route path="access-control" element={<AccessControl />} />

            {/* Projects */}
            <Route path="projects" element={<MyProjects />} />
            <Route path="projects/overview" element={<AdminProjectsOverview />} />
            <Route path="projects/add" element={<AddProject />} />
            <Route path="projects/:id" element={<ProjectDetails />} />

            {/* Time Tracking */}
            <Route path="time-tracking/overview" element={<AdminTimeTrackingOverview />} />

            {/* Clients */}
            <Route path="clients" element={<ClientListingPage />} />
            <Route path="clients/:id" element={<ClientDetailsPage />} />
            <Route path="clients/add" element={<ClientAddPage />} />

            {/* Communication */}
            <Route path="communication" element={<Messages />} />

            {/* Documents */}
            <Route path="documents" element={<Documents />} />
            <Route path="documents/:id" element={<DocumentDetail />} />

            {/* Departments */}
            <Route path="departments" element={<DepartmentList />} />

            {/* Designations */}
            <Route path="designation" element={<DesignationList />} />

            {/* Organization Settings */}
            <Route path="organization-settings" element={<OrganizationSettings />} />

            {/* Calendar */}
            <Route path="calendar" element={<Calendar />} />

            {/* Payroll */}
            <Route path="payroll" element={<PayrollManagement />} />

            {/* Bugs */}
            <Route path="bugs" element={<BugList />} />

            {/* Todos */}
            <Route path="todos" element={<TodoList />} />

            {/* Audit Logs */}
            <Route path="audit-logs" element={<AuditLogList />} />

            {/* Sprint Planning */}
            <Route path="sprints" element={<SprintManagement />} />
            <Route path="sprint-board" element={<AdvancedMiroBoard />} />
            <Route path="epic-management" element={<EpicManagement />} />
        </>
    );
};

export default AdminRoutes;
