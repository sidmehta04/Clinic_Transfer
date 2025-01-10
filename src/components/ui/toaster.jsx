// components/ui/toaster.jsx
import { Toast, ToastProvider, ToastViewport } from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <div className="font-semibold">{title}</div>}
              {description && <div>{description}</div>}
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}