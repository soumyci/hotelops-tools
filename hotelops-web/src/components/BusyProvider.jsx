import { createContext, useContext, useState } from "react";

const BusyCtx = createContext({
  busy: false,
  show: () => {},
  hide: () => {},
});

export function BusyProvider({ children }) {
  const [busy, setBusy] = useState(false);

  const show = () => setBusy(true);
  const hide = () => setBusy(false);

  return (
    <BusyCtx.Provider value={{ busy, show, hide }}>
      {children}
      {busy && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/20">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-300 border-t-transparent" />
        </div>
      )}
    </BusyCtx.Provider>
  );
}

export function useBusy() {
  return useContext(BusyCtx);
}