export default function BeerMugIcon({
  gefuellt,
  size = 22,
  className = "",
}: {
  gefuellt: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 24 26"
      className={className}
      aria-hidden="true"
    >
      {/* Henkel */}
      <path
        d="M18 9 h2.5 a3.2 3.2 0 0 1 0 6.4 h-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {/* Schaum */}
      <rect
        x="4"
        y="2.5"
        width="14"
        height="4"
        rx="2"
        fill={gefuellt ? "#EDE6D6" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Krug-Umriss */}
      <rect
        x="4"
        y="6"
        width="14"
        height="17"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {/* Füllstand */}
      {gefuellt && (
        <rect x="5.5" y="12.5" width="11" height="9" rx="0.5" fill="#C89B3C" />
      )}
    </svg>
  );
}
