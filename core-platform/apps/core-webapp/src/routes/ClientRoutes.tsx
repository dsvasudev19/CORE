import { Route } from "react-router-dom";

// Client Portal
import { ClientDashboard } from "../pages/client/dashboard";
import { ClientProjects } from "../pages/client/projects";
import { ClientInvoices } from "../pages/client/invoices";
import { ClientDocuments } from "../pages/client/documents";
import { ClientMessages } from "../pages/client/messages";
import { ClientSupport } from "../pages/client/support";
import { ClientSettings } from "../pages/client/settings";

// Bugs
import BugList from "../pages/bugs/BugList";

/**
 * Client Routes Component
 * All routes under /c prefix for client portal users
 */
const ClientRoutes = () => {
    return (
        <>
            {/* Dashboard */}
            <Route index element={<ClientDashboard />} />
            <Route path="dashboard" element={<ClientDashboard />} />

            {/* Projects */}
            <Route path="projects" element={<ClientProjects />} />

            {/* Invoices */}
            <Route path="invoices" element={<ClientInvoices />} />

            {/* Documents */}
            <Route path="documents" element={<ClientDocuments />} />

            {/* Messages */}
            <Route path="messages" element={<ClientMessages />} />

            {/* Support */}
            <Route path="support" element={<ClientSupport />} />

            {/* Settings */}
            <Route path="settings" element={<ClientSettings />} />

            {/* Bugs */}
            <Route path="bugs" element={<BugList />} />
        </>
    );
};

export default ClientRoutes;
