interface ToastProps { message: string; type?: 'success' | 'error'; onClose: () => void; }

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  return (
    <div className={`fixed right-4 top-4 z-50 max-w-sm rounded-2xl border px-4 py-3 shadow-soft ${type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
      <div className="flex items-start gap-3">
        <span className="text-sm font-medium">{message}</span>
        <button className="text-xs opacity-60 hover:opacity-100" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}
