export function ToolArtwork({ id }: { id: string }) {
  const sensitivity = [
    "sensitivity-finder",
    "sensitivity-converter",
    "edpi-calculator",
    "cm360-calculator",
  ].includes(id);
  return (
    <div className="tool-art" aria-hidden="true">
      <svg viewBox="0 0 280 84" fill="none">
        {sensitivity ? (
          <>
            <path
              className="art-faint"
              d="M28 42h224M55 15v54M105 15v54M155 15v54M205 15v54"
              stroke="currentColor"
            />
            <path
              className="art-mid"
              d="M60 32v20M220 32v20M60 42h160"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="90"
              y="27"
              width="100"
              height="30"
              rx="5"
              fill="currentColor"
              fillOpacity=".08"
              stroke="currentColor"
              strokeOpacity=".4"
            />
            {id === "sensitivity-converter" ? (
              <path
                d="M115 35h50l-6-5m6 5-6 5M165 49h-50l6-5m-6 5 6 5"
                stroke="currentColor"
                strokeWidth="2"
              />
            ) : (
              <>
                <circle cx="140" cy="42" r="6" fill="currentColor" />
                <path d="M140 18v13M140 53v13" stroke="currentColor" />
              </>
            )}
          </>
        ) : id === "tracking-trainer" ? (
          <>
            <path
              className="art-faint"
              d="M20 64h240M20 20h240M60 10v64M140 10v64M220 10v64"
              stroke="currentColor"
            />
            <path
              className="art-mid"
              d="M18 60C60 60 48 18 93 30S133 70 169 41s55-24 94-18"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <circle cx="169" cy="41" r="13" stroke="currentColor" />
            <circle cx="169" cy="41" r="4" fill="currentColor" />
          </>
        ) : id === "polling-rate-test" ? (
          <>
            {[
              20, 33, 28, 44, 47, 40, 53, 46, 50, 47, 48, 44, 46, 45, 47, 43,
            ].map((height, i) => (
              <rect
                key={i}
                x={29 + i * 14}
                y={70 - height}
                width="5"
                height={height}
                rx="2"
                fill="currentColor"
                opacity={0.2 + i / 24}
              />
            ))}
            <path className="art-faint" d="M22 70h236" stroke="currentColor" />
          </>
        ) : id === "reaction-time-test" ? (
          <>
            <path className="art-faint" d="M20 42h240" stroke="currentColor" />
            <path
              d="M25 42h60l9-13 13 34 16-51 15 45 11-15h107"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="225" cy="42" r="3" fill="currentColor" />
          </>
        ) : (
          <>
            <circle
              className="art-faint"
              cx="140"
              cy="42"
              r="35"
              stroke="currentColor"
            />
            <circle
              className="art-mid"
              cx="140"
              cy="42"
              r="23"
              stroke="currentColor"
              strokeDasharray="3 4"
            />
            <path
              d="M140 19v15M140 50v15M117 42h15M148 42h15"
              stroke="currentColor"
              strokeWidth={id === "crosshair-generator" ? "3" : "1.5"}
            />
            <circle cx="140" cy="42" r="2" fill="currentColor" />
            <path
              className="art-faint"
              d="M38 27v-7h10M242 27v-7h-10M38 57v7h10M242 57v7h-10"
              stroke="currentColor"
            />
          </>
        )}
      </svg>
    </div>
  );
}
