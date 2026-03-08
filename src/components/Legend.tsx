interface LegendProps {
  colorMap: Record<string, string>;
}

export default function Legend({ colorMap }: LegendProps) {
  return (
    <div className="legend">
      {Object.entries(colorMap).map(([type, color]) => (
        <div key={type} className="legend__item">
          <span className="legend__dot" style={{ backgroundColor: color }} />
          <span className="legend__label">{type}</span>
        </div>
      ))}
    </div>
  );
}
