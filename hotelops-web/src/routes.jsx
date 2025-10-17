import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "@/App.jsx";
import Login from "@/pages/auth/index.jsx";

import AdminDashboard from "@/pages/AdminDashboard.jsx";
import AdminRoomsPage from "@/pages/admin/AdminRoomsPage.jsx";
import RoomTypesPage from "@/pages/admin/AdminRoomTypesPage.jsx";
import RatePlansPage from "@/pages/admin/AdminRatePlansPage.jsx";

import CorporateDashboard from "@/pages/CorporateDashboard.jsx";
import StaffDashboard from "@/pages/StaffDashboard.jsx";
import AmenitiesPage from "@/pages/admin/AmenitiesPage.jsx";

import { RequireAuth, RequireRole } from "@/routes/guards.jsx";
// src/routes.jsx  (inside the protected area with corporate role)
import CorporateBookingsPage from "@/pages/corporate/CorporateBookingsPage.jsx";
import AdminUsersPage from "@/pages/admin/AdminUsersPage.jsx";

// src/routes.jsx
import RecordPaymentPage from "@/pages/accounts/RecordPaymentPage.jsx";
import PendingReportPage from "@/pages/accounts/PendingReportPage.jsx";
{/* … (Admin/Hotel area) */}




export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        {/* If someone hits "/", send them somewhere real */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected area w/ shared header (App) */}
        <Route element={<RequireAuth />}>
          <Route element={<App />}>
            {/* Admin */}
            <Route element={<RequireRole role="admin" />}>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/rooms" element={<AdminRoomsPage />} />
              <Route path="/admin/roomtypes" element={<RoomTypesPage />} />
              <Route path="/admin/rateplans" element={<RatePlansPage />} />
              <Route path="/admin/amenities" element={<AmenitiesPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>

            // Corporate
            <Route element={<RequireRole role="corporate" />}>
              <Route path="/corporate" element={<CorporateDashboard />} />
              <Route path="/corporate/*" element={<CorporateDashboard />} /> {/* <- catch-all */}
              <Route path="/corporate/bookings" element={<CorporateBookingsPage />} />
            </Route>

            // Staff
            <Route element={<RequireRole role="staff" />}>
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/staff/*" element={<StaffDashboard />} /> {/* <- catch-all */}
            </Route>


            <Route element={<RequireRole role="admin" />}>
            <Route path="/accounts/payments" element={<RecordPaymentPage />} />
            <Route path="/accounts/pending" element={<PendingReportPage />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
