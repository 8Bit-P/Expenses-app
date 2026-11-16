import type { SVGProps } from "react";

interface VaultIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export default function VaultIcon({
  className = "text-on-surface",
  width = "48",
  height = "48",
  ...props
}: VaultIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* The Safe Body */}
      <rect x="15" y="15" width="70" height="70" rx="16" stroke="currentColor" strokeWidth="8" />
      {/* The Dial Ring */}
      <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="8" />
      {/* The Dial Center */}
      <circle cx="50" cy="50" r="5" fill="currentColor" />
      {/* The Hinge/Tick */}
      <line x1="66" y1="50" x2="76" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
