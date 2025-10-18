// src/pages/PaymentForm.tsx
import { useNavigate } from "react-router-dom";

export default function PaymentForm() {
  const nav = useNavigate();

  return (
    <section style={{ maxWidth: 640 }}>
      <h2 style={{ margin: "8px 0 20px" }}>Record payment</h2>

      <p style={{ opacity: 0.7, marginBottom: 16 }}>
        (Wire the backend later. This screen is here so navigation works end-to-end.)
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => nav("/payments")}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "#000",
            color: "#fff",
            border: 0,
            fontWeight: 600,
          }}
        >
          Back to Payments
        </button>
      </div>
    </section>
  );
}
