export default function Spinner() {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/10">
      <div className="animate-spin rounded-full border-4 border-slate-300 border-t-slate-700 h-10 w-10" />
    </div>
  );
}
