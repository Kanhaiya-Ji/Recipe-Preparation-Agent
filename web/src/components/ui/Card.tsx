import React from "react";

interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Card({ children, header, className = "", as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={[
        "bg-white rounded-2xl shadow-card border border-cream-200",
        className,
      ].join(" ")}
    >
      {header && (
        <div className="px-5 py-4 border-b border-cream-200">{header}</div>
      )}
      <div className="p-5">{children}</div>
    </Tag>
  );
}
