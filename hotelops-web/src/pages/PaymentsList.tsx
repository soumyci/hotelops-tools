// src/pages/PaymentsList.tsx
import { Link } from "react-router-dom";

export default function PaymentsList() {
  // Render-only (no API yet) to guarantee the page shows
  return (
    <section style={{ maxWidth: 780 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h2 style={{ margin: "8px 0 20px" }}>Payments</h2>
        <Link
          to="/payments/new"
          style={{
            marginLeft: "auto",
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: 8,
            background: "#000",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          New
        </Link>
      </header>

      <p>No payments yet.</p>
    </section>
  );
}
