import React from "react";

interface PageTitleSectionProps {
  title: string;
  description: string;
}

export default function PageTitleSection({ title, description }: PageTitleSectionProps) {
  return (
    <div className="flex flex-col gap-1 select-none font-sans">
      <h1 className="text-2xl font-bold text-[#1C1F26] tracking-tight">{title}</h1>
      <p className="text-xs text-[#707887] leading-relaxed">{description}</p>
    </div>
  );
}
