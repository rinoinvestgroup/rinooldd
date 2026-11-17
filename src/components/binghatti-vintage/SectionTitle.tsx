// SectionTitle.tsx
// Centralized responsive section title style for all major headings
import React from "react";

export const sectionTitleClass =
  "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight tracking-wide font-semibold";

export default function SectionTitle({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`${sectionTitleClass} ${className}`} {...props}>
      {children}
    </h2>
  );
}
