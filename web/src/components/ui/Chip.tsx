import React from "react";
import { X } from "lucide-react";

interface ChipProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export function Chip({ label, onRemove, className = "" }: ChipProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
        "bg-sage-100 text-sage-800 border border-sage-200",
        "animate-fade-in",
        className,
      ].join(" ")}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="flex items-center justify-center w-4 h-4 rounded-full text-sage-500 hover:text-sage-800 hover:bg-sage-200 transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-sage-500"
        >
          <X size={11} strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
