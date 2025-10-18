import { useEffect, useState } from "react";
import  http  from "@/api/http";

type Me = { id:string; email:string; displayName?:string; roles:string[] };

export default function HeaderBar() {
  const [me, setMe] = useState<Me | null>(null);
  useEffect(() => { http<Me>("/api/accounts/me").then(setMe).catch(()=>setMe(null)); }, []);
  return (
    <div className="px-6 py-3 border-b flex justify-between items-center">
      <a href="/" className="font-semibold">HotelOps</a>
      <div className="text-sm opacity-80">
        {me ? (<>{me.displayName ?? me.email} · {me.roles.join(", ")}</>) : "Not signed"}
        <a href="/payments" className="px-3">Payments</a>
      </div>

    </div>
  );
}
