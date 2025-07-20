import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/client/home";
import LoginPage from "../pages/loginPage";
import DashboardAdmin from "../pages/admin/dashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
