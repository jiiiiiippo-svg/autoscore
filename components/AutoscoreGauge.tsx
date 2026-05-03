"use client";

interface AutoscoreGaugeProps {
  score: number; // 0–10
}

export default function AutoscoreGauge({ score }: AutoscoreGaugeProps) {
  // Gauge goes from 180° (left, score=0) to 0° (right, score=10)
  // The arc spans 180 degrees (a half-circle)
  const clampedScore = Math.min(10, Math.max(0, score));

  // Map score 0–10 to angle 180°–0° (left to right)
  const angleDeg = 180 - (clampedScore / 10) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;

  // SVG dimensions
  const cx = 150;
  const cy = 140;
  const r = 110;

  // Needle tip position
  const needleTipX = cx + r * 0.85 * Math.cos(angleRad);
  const needleTipY = cy - r * 0.85 * Math.sin(angleRad);

  // Needle base (small offset perpendicular to needle direction)
  const perpAngleRad = angleRad + Math.PI / 2;
  const baseWidth = 5;
  const needleBase1X = cx + baseWidth * Math.cos(perpAngleRad);
  const needleBase1Y = cy - baseWidth * Math.sin(perpAngleRad);
  const needleBase2X = cx - baseWidth * Math.cos(perpAngleRad);
  const needleBase2Y = cy + baseWidth * Math.sin(perpAngleRad);

  // Score color: red → orange → green based on score
  function getScoreColor(s: number): string {
    if (s < 4) return "#ef4444";      // red-500
    if (s < 6) return "#f97316";      // orange-500
    if (s < 7.5) return "#eab308";    // yellow-500
    return "#22c55e";                  // green-500
  }

  const scoreColor = getScoreColor(clampedScore);

  // Build gradient arc segments (red → orange → yellow → green)
  // We draw 3 colored arc segments across the 180° sweep
  function describeArc(
    startAngleDeg: number,
    endAngleDeg: number,
    radius: number
  ): string {
    const startRad = (startAngleDeg * Math.PI) / 180;
    const endRad = (endAngleDeg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy - radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy - radius * Math.sin(endRad);
    const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`;
  }

  const arcRadius = 110;
  const arcWidth = 22;
  const innerRadius = arcRadius - arcWidth;

  function arcSegment(
    startAngleDeg: number,
    endAngleDeg: number
  ): string {
    const sRad = (startAngleDeg * Math.PI) / 180;
    const eRad = (endAngleDeg * Math.PI) / 180;
    const outerX1 = cx + arcRadius * Math.cos(sRad);
    const outerY1 = cy - arcRadius * Math.sin(sRad);
    const outerX2 = cx + arcRadius * Math.cos(eRad);
    const outerY2 = cy - arcRadius * Math.sin(eRad);
    const innerX1 = cx + innerRadius * Math.cos(eRad);
    const innerY1 = cy - innerRadius * Math.sin(eRad);
    const innerX2 = cx + innerRadius * Math.cos(sRad);
    const innerY2 = cy - innerRadius * Math.sin(sRad);
    const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;
    return [
      `M ${outerX1} ${outerY1}`,
      `A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${outerX2} ${outerY2}`,
      `L ${innerX1} ${innerY1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerX2} ${innerY2}`,
      "Z",
    ].join(" ");
  }

  // Score label
  const scoreLabel = clampedScore >= 7.5
    ? "Excellent"
    : clampedScore >= 6
    ? "Bon"
    : clampedScore >= 4
    ? "Moyen"
    : "Faible";

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 300 160"
        className="w-full max-w-xs"
        aria-label={`Score Autoscore : ${clampedScore} sur 10`}
      >
        {/* Background arc — grey track */}
        <path
          d={arcSegment(0, 180)}
          fill="#e5e7eb"
        />

        {/* Colored arc segments: red (180–135), orange (135–90), yellow (90–45), green (45–0) */}
        <path d={arcSegment(135, 180)} fill="#ef4444" opacity="0.85" />
        <path d={arcSegment(90, 135)} fill="#f97316" opacity="0.85" />
        <path d={arcSegment(45, 90)} fill="#eab308" opacity="0.85" />
        <path d={arcSegment(0, 45)} fill="#22c55e" opacity="0.85" />

        {/* Tick marks at each score level */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => {
          const tickAngleDeg = 180 - (tick / 10) * 180;
          const tickRad = (tickAngleDeg * Math.PI) / 180;
          const outerR = arcRadius + 4;
          const innerR = arcRadius - arcWidth - 4;
          return (
            <line
              key={tick}
              x1={cx + innerR * Math.cos(tickRad)}
              y1={cy - innerR * Math.sin(tickRad)}
              x2={cx + outerR * Math.cos(tickRad)}
              y2={cy - outerR * Math.sin(tickRad)}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* Needle shadow for depth */}
        <polygon
          points={`${needleTipX + 1},${needleTipY + 1} ${needleBase1X + 1},${needleBase1Y + 1} ${needleBase2X + 1},${needleBase2Y + 1}`}
          fill="rgba(0,0,0,0.15)"
        />

        {/* Needle */}
        <polygon
          points={`${needleTipX},${needleTipY} ${needleBase1X},${needleBase1Y} ${needleBase2X},${needleBase2Y}`}
          fill={scoreColor}
          stroke="white"
          strokeWidth="1"
        />

        {/* Center pivot circle */}
        <circle cx={cx} cy={cy} r={10} fill={scoreColor} />
        <circle cx={cx} cy={cy} r={5} fill="white" />

        {/* Score text — displayed inside / below the gauge */}
        <text
          x={cx}
          y={cy + 30}
          textAnchor="middle"
          fontSize="28"
          fontWeight="700"
          fill={scoreColor}
          fontFamily="system-ui, sans-serif"
        >
          {clampedScore.toFixed(1)}
        </text>
        <text
          x={cx}
          y={cy + 48}
          textAnchor="middle"
          fontSize="11"
          fill="#6b7280"
          fontFamily="system-ui, sans-serif"
        >
          / 10 — {scoreLabel}
        </text>

        {/* Min / Max labels */}
        <text x="14" y={cy + 12} fontSize="10" fill="#9ca3af" fontFamily="system-ui, sans-serif">0</text>
        <text x="274" y={cy + 12} fontSize="10" fill="#9ca3af" fontFamily="system-ui, sans-serif">10</text>
      </svg>
    </div>
  );
}
