import { formatDate } from '../colors';

interface TimelineEventProps {
  position: number;
  labelPosition: number;
  sideCount: number;
  color: string;
  startDate: string;
  endDate?: string;
  description: string;
  placement: 'above' | 'below';
  spanWidth: number;
}

export default function TimelineEvent({
  position,
  labelPosition,
  sideCount,
  color,
  startDate,
  endDate,
  description,
  placement,
  spanWidth,
}: TimelineEventProps) {
  const dateLabel = endDate
    ? `${formatDate(startDate)} – ${formatDate(endDate)}`
    : formatDate(startDate);

  const isSpan = spanWidth > 0;

  // Marker sits at the date-proportional axis position
  const markerStyle = {
    '--event-position': `${position}%`,
    ...(isSpan ? { '--span-width': `${spanWidth}%` } : {}),
  } as React.CSSProperties;

  const markerClasses = [
    'timeline-event__marker-group',
    `timeline-event__marker-group--${placement}`,
    isSpan ? 'timeline-event__marker-group--span' : '',
  ].filter(Boolean).join(' ');

  // Label sits at the evenly-spaced label position
  const labelWidth = 100 / sideCount;
  const labelStyle = {
    '--label-position': `${labelPosition}%`,
    '--label-slot-width': `${labelWidth}%`,
  } as React.CSSProperties;

  const labelClasses = [
    'timeline-event__label-group',
    `timeline-event__label-group--${placement}`,
  ].join(' ');

  return (
    <>
      {/* Marker group — positioned at true date position on the axis */}
      <div className={markerClasses} style={markerStyle}>
        <div
          className={isSpan ? 'timeline-event__ellipse' : 'timeline-event__marker'}
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Label group — positioned at evenly-spaced slot */}
      <div className={labelClasses} style={labelStyle}>
        <div className="timeline-event__label">
          <div className="timeline-event__date" style={{ color }}>
            {dateLabel}
          </div>
          <div className="timeline-event__description">
            {description}
          </div>
        </div>

        {/* Tooltip — shown on hover */}
        <div className="timeline-event__tooltip" style={{ color }}>
          <div className="timeline-event__tooltip-date">{dateLabel}</div>
          <div className="timeline-event__tooltip-desc">{description}</div>
        </div>
      </div>
    </>
  );
}
