import { useState, useEffect, useRef } from 'react';
import type { TimelineEvent as TEvent } from '../parser';
import TimelineEvent from './TimelineEvent';
import Legend from './Legend';
import './Timeline.css';

interface TimelineProps {
  events: TEvent[];
  colorMap: Record<string, string>;
  onEditClick: () => void;
}

function toTimestamp(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getTime();
}

export default function Timeline({ events, colorMap, onEditClick }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  // Default computed from desktop: 70px / 420px = 16.67%
  const [connectorOffset, setConnectorOffset] = useState(16.67);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const update = () => {
      const h = el.clientHeight;
      if (h === 0) return;
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const labelOffsetPx = isMobile ? 40 : 70; // matches CSS label offsets
      setConnectorOffset((labelOffsetPx / h) * 100);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (events.length === 0) {
    return <p>No events to display.</p>;
  }

  // Compute date range across all events (including end dates)
  const allDates = events.flatMap((e) =>
    e.endDate ? [e.startDate, e.endDate] : [e.startDate]
  );
  const timestamps = allDates.map(toTimestamp);
  const minDate = Math.min(...timestamps);
  const maxDate = Math.max(...timestamps);
  const range = maxDate - minDate || 1;

  // Compute axis positions for all events (date-proportional)
  const axisPositions = events.map((event) => {
    const startTs = toTimestamp(event.startDate);
    return ((startTs - minDate) / range) * 100;
  });

  // Split events by side: above (even indices), below (odd indices)
  const aboveIndices: number[] = [];
  const belowIndices: number[] = [];
  events.forEach((_, i) => {
    if (i % 2 === 0) aboveIndices.push(i);
    else belowIndices.push(i);
  });

  const aboveCount = aboveIndices.length;
  const belowCount = belowIndices.length;

  // Compute evenly-spaced label positions per side
  const labelPositions: number[] = new Array(events.length);
  aboveIndices.forEach((eventIdx, slotIdx) => {
    labelPositions[eventIdx] = ((slotIdx + 0.5) / aboveCount) * 100;
  });
  belowIndices.forEach((eventIdx, slotIdx) => {
    labelPositions[eventIdx] = ((slotIdx + 0.5) / belowCount) * 100;
  });

  // SVG connector Y endpoints: axis at 50%, labels offset from axis
  const endYAbove = 50 - connectorOffset;
  const endYBelow = 50 + connectorOffset;

  return (
    <>
      <div className="timeline-container">
        <div className="timeline" ref={timelineRef}>
          <div className="timeline__axis" />

          {/* SVG spline connectors */}
          <svg
            className="timeline__connectors"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {events.map((event, index) => {
              const color = colorMap[event.type] || '#666';
              const markerX = axisPositions[index];
              const labelX = labelPositions[index];
              const placement = index % 2 === 0 ? 'above' : 'below';

              // For multi-day events, connector starts from the center of the span
              let connectorStartX = markerX;
              if (event.endDate) {
                const startTs = toTimestamp(event.startDate);
                const endTs = toTimestamp(event.endDate);
                const spanWidth = ((endTs - startTs) / range) * 100;
                connectorStartX = markerX + spanWidth / 2;
              }

              const axisY = 50;
              const endY = placement === 'above' ? endYAbove : endYBelow;

              // S-curve: endpoint slightly inset from label slot edge
              const sideCount = placement === 'above' ? aboveCount : belowCount;
              const slotWidth = 100 / sideCount;
              const connectorEndX = labelX - slotWidth / 2 + 1.2;
              const midY = (axisY + endY) / 2;
              const d = `M ${connectorStartX} ${axisY} C ${connectorStartX} ${midY}, ${connectorEndX} ${midY}, ${connectorEndX} ${endY}`;

              return (
                <path
                  key={`conn-${event.startDate}-${event.description}`}
                  d={d}
                  stroke={color}
                  strokeWidth={1.5}
                  strokeOpacity={0.5}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {events.map((event, index) => {
            const position = axisPositions[index];
            const labelPosition = labelPositions[index];

            let spanWidth = 0;
            if (event.endDate) {
              const startTs = toTimestamp(event.startDate);
              const endTs = toTimestamp(event.endDate);
              spanWidth = ((endTs - startTs) / range) * 100;
            }

            const sideCount = index % 2 === 0 ? aboveCount : belowCount;

            return (
              <TimelineEvent
                key={`${event.startDate}-${event.description}`}
                position={position}
                labelPosition={labelPosition}
                sideCount={sideCount}
                color={colorMap[event.type] || '#666'}
                startDate={event.startDate}
                endDate={event.endDate}
                description={event.description}
                placement={index % 2 === 0 ? 'above' : 'below'}
                spanWidth={spanWidth}
              />
            );
          })}
        </div>
      </div>

      <div className="edit-toggle" onClick={onEditClick}>
        <div className="edit-toggle__icon">&#x270E;</div>
      </div>

      <div className="legend-toggle">
        <div className="legend-toggle__icon">?</div>
        <div className="legend-toggle__popup">
          <Legend colorMap={colorMap} />
        </div>
      </div>
    </>
  );
}
