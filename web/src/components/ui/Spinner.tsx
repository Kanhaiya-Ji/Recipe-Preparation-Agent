import React from "react";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-7 h-7 border-[3px]",
  lg: "w-10 h-10 border-4",
};

export function Spinner({ size = "md", className = "", label = "Loading…" }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={["inline-flex", className].join(" ")}>
      <span
        aria-hidden="true"
        className={[
          "rounded-full border-sage-200 border-t-sage-500 animate-spin",
          sizeClasses[size],
        ].join(" ")}
      />
    </span>
  );
}
