import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toastMsg } = useApp();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {toastMsg && (
        <div className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg">{toastMsg}</div>
      )}
    </div>
  );
}
