
import { useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(onClose, 3500)

    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  }

  const icons = {
    success: <CheckCircle2 size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-xl border p-4 shadow-lg sm:bottom-6 sm:right-6 ${styles[toast.type] || styles.info}`}
    >
      <span className="shrink-0">
        {icons[toast.type] || icons.info}
      </span>

      <p className="min-w-0 flex-1 break-words text-sm font-medium">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-black/5"
        aria-label="Close notification"
      >
        <X size={17} />
      </button>
    </div>
  )
}
