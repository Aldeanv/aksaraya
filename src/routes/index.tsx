import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/client/home";
import LoginPage from "../pages/loginPage";
import Dashboard from "../pages/admin/dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import CatalogDetail from "../pages/client/detailPage";
import ProfilePage from "../pages/client/profilePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/catalogs/:id" element={<CatalogDetail />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
