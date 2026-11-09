import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 20, text: "text-base" },
  md: { icon: 28, text: "text-xl" },
  lg: { icon: 36, text: "text-2xl" },
} as const;

export function Logo({ size = "md", showWordmark = true, className }: LogoProps) {
  const s = sizes[size];
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoIcon size={s.icon} />
      {showWordmark && (
        <span className={cn("font-heading font-semibold tracking-tight", s.text)}>
          QELVANTA
        </span>
      )}
    </span>
  );
}

export function LogoIcon({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* Outer Q Ring */}
      <path
        d="M 27.5 16 A 11.5 11.5 0 1 1 20.5 5.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Chart Bars */}
      <path d="M 11 19 V 15" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 14.5 19 V 12" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 18 19 V 9" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 21.5 19 V 14" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Q Tail / Orbit */}
      <path d="M 19 21 L 28 29" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}