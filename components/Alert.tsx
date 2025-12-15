"use client";

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

// Types
interface Alert {
  id: number;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface AlertContextType {
  alert: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    seconds?: number
  ) => number;
  removeAlert: (id: number) => void;
}

// Alert Context - Initialize with undefined, not null
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Alert Provider Component
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const alert = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info",
      seconds = 5
    ) => {
      const id = Date.now() + Math.random();
      const newAlert: Alert = { id, type, message };

      setAlerts((prev) => [...prev, newAlert]);

      if (seconds > 0) {
        setTimeout(() => {
          removeAlert(id);
        }, seconds * 1000);
      }

      return id;
    },
    [removeAlert]
  );

  return (
    <AlertContext.Provider value={{ alert, removeAlert }}>
      {children}
      <AlertContainer alerts={alerts} onClose={removeAlert} />
    </AlertContext.Provider>
  );
};

// Hook to use alerts
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context.alert;
};

// Alert Container Props
interface AlertContainerProps {
  alerts: Alert[];
  onClose: (id: number) => void;
}

// Alert Container (renders all alerts)
const AlertContainer = ({ alerts, onClose }: AlertContainerProps) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full pointer-events-none">
      {alerts.map((alert) => (
        <div key={alert.id} className="pointer-events-auto">
          <AlertComponent
            type={alert.type}
            message={alert.message}
            onClose={() => onClose(alert.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Alert Props
interface AlertComponentProps {
  type?: "success" | "error" | "warning" | "info";
  message: string;
  onClose: () => void;
}

// Individual Alert Component
const AlertComponent = ({
  type = "info",
  message,
  onClose,
}: AlertComponentProps) => {
  const typeStyles = {
    success: {
      container:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 shadow-lg",
      icon: "text-green-600 dark:text-green-500",
      message: "text-green-700 dark:text-green-500",
      IconComponent: CheckCircle,
    },
    error: {
      container:
        "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 shadow-lg",
      icon: "text-red-600 dark:text-red-500",
      message: "text-red-700 dark:text-red-500",
      IconComponent: AlertCircle,
    },
    warning: {
      container:
        "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50 shadow-lg",
      icon: "text-yellow-600 dark:text-yellow-500",
      message: "text-yellow-700 dark:text-yellow-500",
      IconComponent: AlertTriangle,
    },
    info: {
      container:
        "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 shadow-lg",
      icon: "text-blue-600 dark:text-blue-500",
      message: "text-blue-700 dark:text-blue-500",
      IconComponent: Info,
    },
  };

  const styles = typeStyles[type] || typeStyles.info;
  const IconComponent = styles.IconComponent;

  return (
    <div
      className={`rounded-lg border p-4 ${styles.container} animate-in fade-in slide-in-from-right-5 duration-300`}
    >
      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${styles.icon}`} />

        <div className="flex-1 min-w-0">
          <p className={`text-sm ${styles.message}`}>{message}</p>
        </div>

        <button
          onClick={onClose}
          className={`shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${styles.icon}`}
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
