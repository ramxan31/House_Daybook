import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import { Loader2 } from "lucide-react";

export const Button: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    isLoading?: boolean;
  }
> = ({
  className = "",
  variant = "primary",
  isLoading,
  children,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center cursor-pointer rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-teal-600 text-white hover:bg-teal-500 shadow-lg shadow-teal-900/20",
    secondary:
      "bg-white dark:bg-navy-800 text-navy-900 dark:text-teal-500 border border-slate-200 dark:border-teal-600/30 hover:bg-slate-50 dark:hover:bg-navy-700 shadow-sm dark:shadow-none",
    danger:
      "bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900",
    ghost:
      "bg-transparent text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
  };

  const sizes = "px-4 py-3 text-sm ";

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => (
  <input
    className={`w-full text-sm bg-white dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all ${className}`}
    {...props}
  />
);

export const Select: React.FC<SelectHTMLAttributes<HTMLSelectElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <div className="relative">
    <select
      className={`w-full text-sm bg-white dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all appearance-none ${className}`}
      {...props}
    >
      {children}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg
        className="w-4 h-4 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </div>
  </div>
);

export const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className = "", ...props }) => (
  <textarea
    className={`w-full bg-white dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all ${className}`}
    {...props}
  />
);

export const Label: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <label
    className={`block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ${className}`}
  >
    {children}
  </label>
);

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
}> = ({ children, className = "", title }) => (
  <div
    className={`bg-white dark:bg-navy-800/50 dark:backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm dark:shadow-none ${className}`}
  >
    {title && (
      <h3 className="font-serif text-navy-800 dark:text-gold-500 text-lg mb-4 font-semibold tracking-wide">
        {title}
      </h3>
    )}
    {children}
  </div>
);
