"use client";

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");
}

function interpolateColor(color1: string, color2: string, factor: number) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  return rgbToHex(
    c1.r + (c2.r - c1.r) * factor,
    c1.g + (c2.g - c1.g) * factor,
    c1.b + (c2.b - c1.b) * factor
  );
}

export function getScoreColor(score: number) {
  if (score <= 5) return interpolateColor("#ef4444", "#f59e0b", score / 5);
  return interpolateColor("#f59e0b", "#16a34a", (score - 5) / 5);
}

export default function AutoscoreGauge({ score, size = 300 }: { score: number; size?: number }) {
  const safeScore = Math.max(0, Math.min(10, score));
  const angle = -90 + (safeScore / 10) * 180;
  const dynamicColor = getScoreColor(safeScore);

  const centerX = size / 2;
  const centerY = size * 0.72;
  const radius = size * 0.34;
  const stroke = Math.max(12, size * 0.065);

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  }

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  }

  const scoreLabel = safeScore < 5 ? "À améliorer" : safeScore < 8 ? "Correct" : "Très bon";

  return (
    <div className="mx-auto flex justify-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size * 0.82 }}>
        <svg width={size} height={size * 0.82} viewBox={`0 0 ${size} ${size * 0.82}`}>
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>

          <path d={describeArc(centerX, centerY, radius, -90, 90)} fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round" />
          <path d={describeArc(centerX, centerY, radius, -90, angle)} fill="none" stroke="url(#scoreGradient)" strokeWidth={stroke} strokeLinecap="round" />

          <text x={centerX - radius - 12} y={centerY + 9} fontSize={size * 0.045} fill="#64748b" fontWeight="700">0</text>
          <text x={centerX - 6} y={centerY - radius - 14} fontSize={size * 0.045} fill="#64748b" fontWeight="700">5</text>
          <text x={centerX + radius - 4} y={centerY + 9} fontSize={size * 0.045} fill="#64748b" fontWeight="700">10</text>
        </svg>

        <div
          className="absolute left-1/2 w-[5px] rounded-full bg-slate-950 shadow-lg transition-transform duration-700"
          style={{
            height: size * 0.28,
            bottom: size * 0.075,
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transformOrigin: "bottom center",
          }}
        />

        <div
          className="absolute left-1/2 rounded-full bg-slate-950 shadow-lg"
          style={{
            bottom: size * 0.047,
            width: size * 0.085,
            height: size * 0.085,
            transform: "translateX(-50%)",
          }}
        />

        <div className="absolute left-1/2 top-[47%] w-[72%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="font-black leading-none tracking-[-0.05em]" style={{ color: dynamicColor, fontSize: size * 0.18 }}>
            {safeScore.toFixed(1)}
          </div>
          <div className="mt-2 text-sm font-extrabold text-slate-500">Score Autoscore</div>
          <div className="mt-2 inline-flex rounded-full border bg-white px-3 py-1 text-xs font-black" style={{ color: dynamicColor, borderColor: dynamicColor }}>
            {scoreLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
