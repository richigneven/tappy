export default function TappyLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Zapfhahn-Griff (Querbalken des T) */}
        <rect x="3" y="4" width="26" height="6" rx="3" fill="currentColor" />
        {/* Zapfhahn-Säule (Stamm des T) */}
        <rect x="13" y="8" width="6" height="19" rx="3" fill="currentColor" />
        {/* Auslauf-Tropfen */}
        <circle cx="16" cy="30" r="1.6" fill="currentColor" opacity="0.7" />
      </svg>
      <span className="font-display font-black text-2xl tracking-tight">
        appy
      </span>
    </span>
  );
}
