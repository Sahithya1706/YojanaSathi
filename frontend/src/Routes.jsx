import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/dashboard";
import SchemesPage from "./pages/schemes";
import ProfilePage from "./pages/profile";
import SchemeDetailsPage from "./pages/scheme-details";
import Register from "./pages/register";
import Login from "./pages/login";
import HomePage from "./pages/home-page";
import QuizPage from "./pages/quiz";
import QuizResultPage from "./pages/quiz/QuizResultPage";
import EligibilityCheckerPage from "./pages/eligibility-checker";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageSchemes from "./pages/admin/ManageSchemes";
import ManageUsers from "./pages/admin/ManageUsers";
import Analytics from "./pages/admin/Analytics";
import { getCurrentUser, isAdminLoggedIn } from "./utils/auth";
import ChatbotPanel from "components/chatbot/ChatbotPanel";

const AdminProtectedRoute = ({ children }) => {
  const isAdmin = isAdminLoggedIn();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

const LoginRoute = ({ children }) => {
  const isAdmin = isAdminLoggedIn();
  const user = getCurrentUser();

  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />

        <RouterRoutes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home-page" element={<Navigate to="/" replace />} />

          <Route
            path="/login"
            element={
              <LoginRoute>
                <Login />
              </LoginRoute>
            }
          />

          <Route path="/register" element={<Register />} />

          <Route
            path="/eligibility"
            element={
              <ProtectedRoute>
                <EligibilityCheckerPage />
              </ProtectedRoute>
            }
          />
          <Route path="/eligibility-checker" element={<Navigate to="/eligibility" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/result"
            element={
              <ProtectedRoute>
                <QuizResultPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/schemes"
            element={
              <ProtectedRoute>
                <SchemesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/scheme/:id"
            element={
              <ProtectedRoute>
                <SchemeDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              isAdminLoggedIn()
                ? <Navigate to="/admin/dashboard" replace />
                : <Navigate to="/admin/login" replace />
            }
          />

          <Route
            path="/admin/login"
            element={
              isAdminLoggedIn()
                ? <Navigate to="/admin/dashboard" replace />
                : (
                  <LoginRoute>
                    <Login />
                  </LoginRoute>
                )
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/schemes"
            element={
              <AdminProtectedRoute>
                <ManageSchemes />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <ManageUsers />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <AdminProtectedRoute>
                <Analytics />
              </AdminProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>

        <ChatbotPanel />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
