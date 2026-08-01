"use client";

// Ícone de raquete (o lucide não tem um bom)
export function RacquetIcon({ size = 20, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="14.5" cy="9.5" rx="6.5" ry="7.5" transform="rotate(45 14.5 9.5)" />
      <path d="M9.5 14.5 3.5 20.5" />
      <path d="M11.5 6.5v6M14.5 5v9M17.5 6.5v6" opacity="0.6" strokeWidth={1} />
      <path d="M9.5 8.5h9M8.8 11.5h10.4M10 14.5h8" opacity="0.6" strokeWidth={1} />
    </svg>
  );
}
