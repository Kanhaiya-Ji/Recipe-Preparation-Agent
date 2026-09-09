import React from "react";

interface ToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function Toggle({ id, label, checked, onChange, className = "" }: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className={[
        "inline-flex items-center gap-2.5 cursor-pointer select-none group",
        className,
      ].join(" ")}
    >
      {/* Hidden native checkbox for accessibility */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
        aria-checked={checked}
      />
      {/* Pill track */}
      <span
        aria-hidden="true"
        className={[
          "relative inline-flex w-9 h-5 rounded-full transition-colors duration-200",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-sage-500",
          checked ? "bg-sage-500" : "bg-gray-200",
        ].join(" ")}
      >
        {/* Thumb */}
        <span
          className={[
            "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm",
            "transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0",
          ].join(" ")}
        />
      </span>
      <span
        className={[
          "text-sm font-medium transition-colors",
          checked ? "text-sage-800" : "text-gray-500 group-hover:text-gray-700",
        ].join(" ")}
      >
        {label}
      </span>
    </label>
  );
}
