import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import ClientLayout from "./layouts/ClientLayout";

// Auth
import { Login } from "./pages/auth";

// Dashboard
import { Dashboard, EmployeeHome } from "./pages/dashboard";

// Employees
import {
    EmployeeList,
    EmployeeDetails,
    AddOrEditEmployee as EmployeeModalDemo,
    EmployeeOnboarding
} from "./pages/employees";

// Teams
import { TeamManagement, MyTeam } from "./pages/teams";

// Tasks
import { EmployeeTasks, TaskDetails as TaskDetail, TodoManagement } from "./pages/tasks";

// Projects
import { MyProjects, ProjectDetails, AddProject } from "./pages/projects";

// Time Tracking
import { EmployeeTimeTracking } from "./pages/time-tracking";

// Documents
import { Documents, DocumentDetail } from "./pages/documents";

// Calendar
import { Calendar } from "./pages/calendar";

// Messages
import { Messages } from "./pages/messages";

// Leave
import { LeaveRequests } from "./pages/leave";

// Profile
import { MyProfile } from "./pages/profile";

// Attendancen
import { AttendanceDashboard } from "./pages/attendance";

// Payroll
import { PayrollManagement } from "./pages/payroll";

// Performance
import { PerformanceReviews, PerformanceReviewDetails } from "./pages/performance";

// Reports
import { ReportsAnalytics } from "./pages/reports";

// Recruitment
import { Recruitment, JobDetails } from "./pages/recruitment";

// Training
import { TrainingDevelopment } from "./pages/training";

// Announcements
import { Announcements, AnnouncementDetails } from "./pages/announcements";

// Notifications
import { NotificationsCenter } from "./pages/notifications";

// Settings
import { Settings } from "./pages/settings";

// Access Control
import { AccessControl } from "./pages/access-control";

// Client Portal
import { ClientDashboard } from "./pages/client/dashboard";
import { ClientProjects } from "./pages/client/projects";
import { ClientInvoices } from "./pages/client/invoices";
import { ClientDocuments } from "./pages/client/documents";
import { ClientMessages } from "./pages/client/messages";
import { ClientSupport } from "./pages/client/support";
import { ClientSettings } from "./pages/client/settings";
import AuthGuard from "./contexts/AuthGuard";
import AdvancedMiroBoard from "./pages/sprint-planning/SprintPlanning";
import EpicManagement from "./pages/sprint-planning/EpicManagement";
import ClientListingPage from "./pages/client-management/ClientManagement";
import ClientDetailsPage from "./pages/client-management/ClientDetails";
import ClientAddPage from "./pages/client-management/AddClient";
import DepartmentList from "./pages/departments/DepartmentList";
import DesignationList from "./pages/designations/DesignationList";
import OrganizationSettings from "./pages/organization-settings/OrganizationSettings";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/miro" element={<AdvancedMiroBoard />} />
                <Route path="/epic" element={<EpicManagement />} />
                {/* Redirect root to admin dashboard */}
                <Route path="/" element={<Navigate to="/a/dashboard" replace />} />

                {/* Login Route */}
                <Route path="/auth/login" element={<AuthGuard><Login /></AuthGuard>} />

                {/* Admin Routes */}
                <Route path="/a" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="employees" element={<EmployeeList />} />
                    <Route path="employees/details" element={<EmployeeDetails />} />
                    <Route path="employees/add" element={<EmployeeModalDemo />} />
                    <Route path="employees/edit" element={<EmployeeModalDemo />} />
                    <Route path="employees/onboarding" element={<EmployeeOnboarding />} />
                    <Route path="teams" element={<TeamManagement />} />
                    <Route path="payroll" element={<PayrollManagement />} />
                    <Route path="attendance" element={<AttendanceDashboard />} />
                    <Route path="performance" element={<PerformanceReviews />} />
                    <Route path="reports" element={<ReportsAnalytics />} />
                    <Route path="training" element={<TrainingDevelopment />} />
                    <Route path="recruitment" element={<Recruitment />} />
                    <Route path="recruitment/job/:id" element={<JobDetails />} />
                    <Route path="announcements" element={<Announcements />} />
                    <Route path="announcements/:id" element={<AnnouncementDetails />} />
                    <Route path="performance/:id" element={<PerformanceReviewDetails />} />
                    <Route path="notifications" element={<NotificationsCenter />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="access-control" element={<AccessControl />} />
                    {/* Placeholder routes for other admin sections */}
                    <Route path="projects" element={<MyProjects />} />
                    <Route path="projects/add" element={<AddProject />} />
                    <Route path="projects/:id" element={<ProjectDetails />} />
                    <Route path="clients" element={<ClientListingPage />} />
                    <Route path="clients/:id" element={<ClientDetailsPage />} />
                    <Route path="clients/add" element={<ClientAddPage />} />
                    <Route path="communication" element={<Messages />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="documents/:id" element={<DocumentDetail />} />
                    <Route path="departments" element={<DepartmentList />} />
                    <Route path="designation" element={<DesignationList />} />
                    <Route path="organization-settings" element={<OrganizationSettings />} />
                    <Route path="calendar" element={<Calendar />} />
                </Route>

                {/* Employee Routes */}
                <Route path="/e" element={<AuthGuard><EmployeeLayout /></AuthGuard>}>
                    <Route path="dashboard" element={<EmployeeHome />} />
                    <Route path="profile" element={<MyProfile />} />
                    <Route path="projects" element={<MyProjects />} />
                    <Route path="projects/add" element={<AddProject />} />

                    <Route path="projects/:id" element={<ProjectDetails />} />
                    <Route path="tasks" element={<EmployeeTasks />} />
                    <Route path="todos" element={<TodoManagement />} />
                    <Route path="timesheet" element={<EmployeeTimeTracking />} />
                    <Route path="time-tracking" element={<EmployeeTimeTracking />} />
                    <Route path="team" element={<MyTeam />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="documents/:id" element={<DocumentDetail />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="leave" element={<LeaveRequests />} />
                    <Route path="performance" element={<PerformanceReviews />} />
                    <Route path="performance/:id" element={<PerformanceReviewDetails />} />
                    <Route path="training" element={<TrainingDevelopment />} />
                    <Route path="announcements" element={<Announcements />} />
                    <Route path="announcements/:id" element={<AnnouncementDetails />} />
                    <Route path="notifications" element={<NotificationsCenter />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="task-detail/:id" element={<TaskDetail />} />
                </Route>

                {/* Client Portal Routes */}
                <Route path="/c" element={<ClientLayout />}>
                    <Route path="dashboard" element={<ClientDashboard />} />
                    <Route path="projects" element={<ClientProjects />} />
                    <Route path="invoices" element={<ClientInvoices />} />
                    <Route path="documents" element={<ClientDocuments />} />
                    <Route path="messages" element={<ClientMessages />} />
                    <Route path="support" element={<ClientSupport />} />
                    <Route path="settings" element={<ClientSettings />} />
                </Route>

                {/* Legacy routes for backward compatibility */}
                <Route path="/dashboard" element={<Navigate to="/a/dashboard" replace />} />
                <Route path="/employees" element={<Navigate to="/a/employees" replace />} />
                <Route path="/employee-list" element={<Navigate to="/a/employees" replace />} />
                <Route path="/employee-details" element={<Navigate to="/a/employees/details" replace />} />
                <Route path="/add-or-edit" element={<Navigate to="/a/employees/add" replace />} />
                <Route path="/employee-onboarding" element={<Navigate to="/a/employees/onboarding" replace />} />
                <Route path="/teams" element={<Navigate to="/a/teams" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;