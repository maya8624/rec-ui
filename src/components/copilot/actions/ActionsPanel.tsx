import { useState } from "react";
import {
  Search,
  MapPin,
  TrendingUp,
  GraduationCap,
  FileText,
} from "lucide-react";

interface Props {
  onAction: (label: string) => void;
  disabled?: boolean;
}

const actions = [
  { label: "Find matching properties", icon: Search },
  { label: "Suburb summary", icon: MapPin },
  { label: "Rental market trends", icon: TrendingUp },
  { label: "School catchments", icon: GraduationCap },
  { label: "View tenancy docs", icon: FileText },
];

export function ActionsPanel({ onAction, disabled }: Props) {
  const [active, setActive] = useState<string | null>(null);

  function handleClick(label: string) {
    setActive(label);
    onAction(label);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => handleClick(label)}
          disabled={disabled}
          className={`flex items-center gap-2 px-2.5 py-1.5 w-full rounded-md border text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
            ${
              active === label
                ? "border-gold bg-gold/10 text-gold font-medium"
                : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:border-gold/60 hover:text-gold"
            }`}
        >
          <Icon className="w-3 h-3 shrink-0" />
          {label}
        </button>
      ))}
    </div>
  );
}
