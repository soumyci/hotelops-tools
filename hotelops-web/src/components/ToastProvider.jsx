import { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext({
  push: () => {},
});

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((msg, type = "info") => {
    const id = crypto.randomUUID();
    setItems((a) => [...a, { id, msg, type }]);
    setTimeout(() => setItems((a) => a.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={
              "rounded-lg px-3 py-2 shadow text-white " +
              (t.type === "error" ? "bg-rose-600" :
               t.type === "success" ? "bg-emerald-600" : "bg-slate-800")
            }
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
