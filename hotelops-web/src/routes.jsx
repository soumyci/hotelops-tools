// src/routes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";

import BookingsList from "./pages/BookingsList";
import BookingForm from "./pages/BookingForm";

import PaymentsList from "./pages/PaymentsList";
import PaymentForm from "./pages/PaymentForm";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default → bookings */}
        <Route path="/" element={<Navigate to="/bookings" replace />} />

        {/* layout */}
        <Route element={<App />}>
          {/* bookings */}
          <Route path="/bookings" element={<BookingsList />} />
          <Route path="/bookings/new" element={<BookingForm />} />

          {/* payments */}
          <Route path="/payments" element={<PaymentsList />} />
          <Route path="/payments/new" element={<PaymentForm />} />
        </Route>

        {/* catch-all */}
        <Route path="*" element={<Navigate to="/bookings" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
