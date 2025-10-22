import { useEffect } from "react";

export default function RoleHome(){
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin")      window.location.replace("/dashboard");
    else if (role === "corporate") window.location.replace("/corporate");
    else if (role === "staff") window.location.replace("/staff");
    else window.location.replace("/login");
  }, []);
  return null;
}
