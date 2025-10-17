// src/hooks/useLogout.jsx
import { useNavigate } from "react-router-dom";
export default function useLogout() {
  const navigate = useNavigate();
  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth:changed"));
    navigate("/login", { replace: true });
  };
}
