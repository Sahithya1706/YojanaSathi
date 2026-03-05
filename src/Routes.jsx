import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/dashboard";
import Register from "./pages/register";
import Login from "./pages/login";
import HomePage from "./pages/home-page";
import QuizPage from "./pages/quiz";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageSchemes from "./pages/admin/ManageSchemes";
import ManageUsers from "./pages/admin/ManageUsers";

const Routes = () => {
  return (
    <BrowserRouter>

      <ErrorBoundary>

        <ScrollToTop />

        <RouterRoutes>

          {/* PUBLIC ROUTES */}

          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/quiz" element={<QuizPage />} />



          {/* ADMIN ROUTES */}

          <Route path="/admin" element={<AdminLogin />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/schemes" element={<ManageSchemes />} />

          <Route path="/admin/users" element={<ManageUsers />} />



          {/* 404 */}

          <Route path="*" element={<NotFound />} />

        </RouterRoutes>

      </ErrorBoundary>

    </BrowserRouter>
  );
};

export default Routes;