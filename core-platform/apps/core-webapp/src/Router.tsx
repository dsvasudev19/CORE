import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import ClientLayout from "./layouts/ClientLayout";
import EmptyLayout from "./layouts/EmptyLayout";

// Auth Pages
import { Login } from "./pages/auth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Auth Guard
import AuthGuard from "./contexts/AuthGuard";

// Route Modules
import AdminRoutes from "./routes/AdminRoutes";
import EmployeeRoutes from "./routes/EmployeeRoutes";
import ClientRoutes from "./routes/ClientRoutes";

// Special Pages
import AdvancedMiroBoard from "./pages/sprint-planning/SprintPlanning";
import EpicManagement from "./pages/sprint-planning/EpicManagement";
import ChatPDF from "./components/pdf/Preview";
import DataTableDemo from "./pages/demo/DataTableDemo";

/**
 * Main Router Component
 * Organizes routes into separate modules:
 * - /a/* - Admin routes
 * - /e/* - Employee routes
 * - /c/* - Client portal routes
 * - /auth/* - Authentication routes
 */
const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Root - Redirect to admin dashboard */}
                <Route path="/" element={<Navigate to="/a/dashboard" replace />} />

                {/* Authentication Routes */}
                <Route path="/auth" element={<AuthGuard><EmptyLayout /></AuthGuard>}>
                    <Route path="login" element={<Login />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                </Route>

                {/* Admin Routes - /a/* */}
                <Route path="/a" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
                    {AdminRoutes()}
                </Route>

                {/* Employee Routes - /e/* */}
                <Route path="/e" element={<AuthGuard><EmployeeLayout /></AuthGuard>}>
                    {EmployeeRoutes()}
                </Route>

                {/* Client Portal Routes - /c/* */}
                <Route path="/c" element={<ClientLayout />}>
                    {ClientRoutes()}
                </Route>

                {/* Special/Demo Routes */}
                <Route path="/miro" element={<AdvancedMiroBoard />} />
                <Route path="/epic" element={<EpicManagement />} />
                <Route path="/previewer" element={<ChatPDF />} />
                <Route path="/demo/datatable" element={<DataTableDemo />} />

                {/* Legacy Routes - Backward Compatibility */}
                <Route path="/dashboard" element={<Navigate to="/a/dashboard" replace />} />
                <Route path="/employees" element={<Navigate to="/a/employees" replace />} />
                <Route path="/employee-list" element={<Navigate to="/a/employees" replace />} />
                <Route path="/employee-details" element={<Navigate to="/a/employees/details" replace />} />
                <Route path="/add-or-edit" element={<Navigate to="/a/employees/add" replace />} />
                <Route path="/employee-onboarding" element={<Navigate to="/a/employees/onboarding" replace />} />
                <Route path="/teams" element={<Navigate to="/a/teams" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
