// src/pages/auth/index.jsx (login)
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const doLogin = (role, to) => {
    localStorage.setItem("token", "dev-token");
    localStorage.setItem("role", role);
    window.dispatchEvent(new Event("auth:changed"));
    navigate(to, { replace: true });
  };

  return (
    <div>
      <h2>Dev Login</h2>
      <button onClick={() => doLogin("admin", "/dashboard")}>Login as Admin</button>
      <button onClick={() => doLogin("corporate", "/corporate")}>Manager</button>
      <button onClick={() => doLogin("staff", "/staff")}>Guest</button>
    </div>
  );
}
