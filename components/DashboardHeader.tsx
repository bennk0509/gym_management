import React from "react";
import { DashboardHeaderProps } from "@/data/sessions";


export default function DashboardHeader({ title, buttonText, onButtonClick }: DashboardHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <h1 className="text-3xl font-heading text-brand-primary">{title}</h1>
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="bg-accent-primary text-brand-primary font-bold px-4 py-2 rounded-lg hover:bg-accent-800"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
