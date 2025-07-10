import React from "react";
import { COLORS } from "./theme";

// PUBLIC_INTERFACE
function LogoIcon({ size = 48, style }) {
  /** Minimal Tic Tac Toe SVG Logo */
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-label="tic tac toe logo"
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={COLORS.primary} strokeWidth="2.8">
        <line x1="16" y1="8" x2="16" y2="40" />
        <line x1="32" y1="8" x2="32" y2="40" />
        <line x1="8" y1="16" x2="40" y2="16" />
        <line x1="8" y1="32" x2="40" y2="32" />
      </g>
      <circle
        cx="12"
        cy="12"
        r="5"
        stroke={COLORS.accent}
        strokeWidth="2.2"
        fill="none"
      />
      <g stroke={COLORS.secondary} strokeWidth="2.4" strokeLinecap="round">
        <line x1="37" y1="37" x2="31" y2="31" />
        <line x1="37" y1="31" x2="31" y2="37" />
      </g>
    </svg>
  );
}

export default LogoIcon;
