// @ts-nocheck
import React from "react";

export function IconHeart({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7.5-4.6-10-9.3C0.4 8 2 4 6 4c2.2 0 3.7 1.2 6 3.5C14.3 5.2 15.8 4 18 4c4 0 5.6 4 4 7.7C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export function IconShare() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4" />
    </svg>
  );
}

export function IconCompare() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 3v18M16 3v18M4 8h4M16 8h4M4 16h4M16 16h4" />
    </svg>
  );
}

export function IconStar({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill={filled ? "#F5C24C" : "none"} stroke="#F5C24C" strokeWidth="1.5">
      <path d="M12 2l2.9 6.4 6.9.7-5.2 4.7 1.5 6.9L12 17.6 5.9 20.7l1.5-6.9L2.2 9.1l6.9-.7L12 2z" />
    </svg>
  );
}

export function Stars({ value }) {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <IconStar key={n} filled={n <= full} />
      ))}
    </div>
  );
}

