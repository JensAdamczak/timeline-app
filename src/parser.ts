export interface TimelineEvent {
  startDate: string;
  endDate?: string;
  type: string;
  description: string;
}

export interface TimelineData {
  events: TimelineEvent[];
}

const MULTI_DAY_RE =
  /^(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})\s+\[([^\]]+)\]\s+(.+)$/;
const SINGLE_DAY_RE =
  /^(\d{4}-\d{2}-\d{2})\s+\[([^\]]+)\]\s+(.+)$/;

export function parseTimeline(raw: string): TimelineData {
  const lines = raw.split('\n');

  const events: TimelineEvent[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip headings and blank lines
    if (trimmed.startsWith('#') || trimmed === '') {
      continue;
    }

    // Try multi-day first (greedy)
    const multiMatch = trimmed.match(MULTI_DAY_RE);
    if (multiMatch) {
      events.push({
        startDate: multiMatch[1],
        endDate: multiMatch[2],
        type: multiMatch[3],
        description: multiMatch[4],
      });
      continue;
    }

    // Fall back to single-date
    const singleMatch = trimmed.match(SINGLE_DAY_RE);
    if (singleMatch) {
      events.push({
        startDate: singleMatch[1],
        type: singleMatch[2],
        description: singleMatch[3],
      });
    }
  }

  events.sort((a, b) => a.startDate.localeCompare(b.startDate));

  return { events };
}
