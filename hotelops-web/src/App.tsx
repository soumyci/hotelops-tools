// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HeaderBar from "./components/HeaderBar";
import BookingsList from "./pages/BookingsList";
import BookingForm from "./pages/BookingForm";
import PaymentsList from "./pages/PaymentsList";
import PaymentForm from "./pages/PaymentForm";

// inside <Routes>


export default function App() {
  return (
    <BrowserRouter>
      <HeaderBar />
      <Routes>
        <Route path="/" element={<Navigate to="/bookings" />} />
        <Route path="/bookings" element={<BookingsList />} />
        <Route path="/bookings/new" element={<BookingForm />} />
        

      
      </Routes>
    </BrowserRouter>
  );
}
