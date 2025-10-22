import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleHome from "./pages/RoleHome";
import AdminDashboard from "@/pages/AdminDashboard.jsx";
import AdminRoomsPage from "@/pages/admin/AdminRoomsPage.jsx";
import RoomTypesPage from "@/pages/admin/AdminRoomTypesPage.jsx";
import RatePlansPage from "@/pages/admin/AdminRatePlansPage.jsx";
import AmenitiesPage from "@/pages/admin/AmenitiesPage.jsx";
import AdminUsersPage from "@/pages/admin/AdminUsersPage.jsx";
import CorporateDashboard from "@/pages/CorporateDashboard.jsx";
import CorporateBookingsPage from "@/pages/corporate/CorporateBookingsPage.jsx";
import StaffDashboard from "@/pages/StaffDashboard.jsx";
import PaymentCreate from "@/pages/accounts/PaymentCreate.jsx";
import RecordPaymentPage from "@/pages/accounts/RecordPaymentPage.jsx";
import PendingReportPage from "@/pages/accounts/PendingReportPage.jsx";
import BookingCreate from "@/pages/BookingCreate.jsx";
import { RequireAuth, RequireRole } from "./routes/guards";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/" element={<RoleHome />} />

        {/* Protected */}
        <Route element={<RequireAuth />}>
          <Route element={<App />}>
            <Route element={<RequireRole role="admin" />}>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/rooms" element={<AdminRoomsPage />} />
              <Route path="/admin/roomtypes" element={<RoomTypesPage />} />
              <Route path="/admin/rateplans" element={<RatePlansPage />} />
              <Route path="/admin/amenities" element={<AmenitiesPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/accounts/payments" element={<RecordPaymentPage />} />
              <Route path="/accounts/pending" element={<PendingReportPage />} />
            </Route>

            <Route element={<RequireRole role="corporate" />}>
              <Route path="/corporate" element={<CorporateDashboard />} />
              <Route path="/corporate/bookings" element={<CorporateBookingsPage />} />
              <Route path="/book" element={<BookingCreate />} />
            </Route>

            <Route element={<RequireRole role="staff" />}>
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/staff/payments" element={<PaymentCreate />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}