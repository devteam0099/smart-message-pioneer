import React from "react";
import SignUp from "./components/Signup/SignUp";
import Login from "./components/Login/LogIn";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResetPw from "./components/Password_Reset/ResetPw";
import EmailSent from "./components/Password_Reset/EmailSent";
import ResetForm from "./components/Password_Reset/ResetForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AgentProtectedRoute from "./Utils/ProtectedRouting/AgentProtectedRoute";
import UserProtectedRoute from "./Utils/ProtectedRouting/UserProtectedRoute";
import AgentDashboard from "./Pages/AgentDashboard/AgentDashboard";
import TemplateManagementPage from "./Pages/TemplateManagement/TemplateManagementPage";
import AgentManagementPage from "./Pages/AgentManagement/AgentManagementPage";
import AccountManagementPage from "./Pages/AccountManagement/AccountManagementPage";
import ProfileSettingsPage from "./Pages/ProfileSettings/ProfileSettingsPage";
import FAQPage from "./Pages/FAQ/FAQPage";
import HelpCenterPage from "./Pages/Help/HelpCenterPage";
import CreateTicketPage from "./Pages/ContacSupport/CreateTicketPage";
import TicketManagementPage from "./Pages/ContacSupport/TicketManagementPage";
import TicketDetailPage from "./Pages/ContacSupport/TicketDetailPage";
import AdminTicketManagementPage from "./Pages/AdminTicketManagement/AdminTicketManagementPage";
import AdminProtectedRoute from "./Utils/ProtectedRouting/AdminProtectRoute";
import AdminUserManagement from "./components/AdminUserManagement/AdminUserManagement";
import AdminUserManagementPage from "./Pages/AdminUserManagement/AdminUserManagementPage";
import FaqAdminPage from './Pages/FAQ/FAQAdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-pw" element={<ResetPw />} />
        <Route path="/reset-pw/email-sent" element={<EmailSent />} />
        <Route path="/reset-password" element={<ResetForm />} />
        <Route element={<AgentProtectedRoute />}>
          <Route path="/dashboard" element={<AgentDashboard />} />
          <Route path="/profile" element={<ProfileSettingsPage />} />
        </Route>
        <Route element={<UserProtectedRoute />}>
          <Route
            path="/template-management"
            element={<TemplateManagementPage />}
          />
          <Route path="/agent-management" element={<AgentManagementPage />} />
          <Route
            path="/account-management"
            element={<AccountManagementPage />}
          />
          <Route path="/settings" element={<ProfileSettingsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/contact-support" element={<TicketManagementPage />} />
          <Route
            path="/contact-support/create-ticket"
            element={<CreateTicketPage />}
          />
          <Route
            path="/contact-support/ticket-detail/:id"
            element={<TicketDetailPage />}
          />
        </Route>
        <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/settings" element={<ProfileSettingsPage />} />

          <Route
            path="/admin/ticket-management"
            element={<AdminTicketManagementPage />}
          />
          <Route
            path="/admin/ticket-management/ticket-detail/:id"
            element={<TicketDetailPage />}
          />
          <Route
            path="/admin/user-management"
            element={<AdminUserManagementPage />}
          />
          <Route
            path="/admin/FAQS"
            element={<FaqAdminPage />}
          />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
