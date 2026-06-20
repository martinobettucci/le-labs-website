/**
 * Human-friendly relative time, e.g. "3 days ago", "in 2 hours".
 * Uses Intl.RelativeTimeFormat with the largest sensible unit.
 */
export function formatRelativeTime(input: string | number | Date, locale = 'en'): string {
  const d = new Date(input);
  if (isNaN(d.getTime())) return '';

  const diffMs = d.getTime() - Date.now();
  const abs = Math.abs(diffMs);

  const sec = 1000;
  const min = 60 * sec;
  const hr = 60 * min;
  const day = 24 * hr;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (abs < min) return rtf.format(Math.round(diffMs / sec), 'second');
  if (abs < hr) return rtf.format(Math.round(diffMs / min), 'minute');
  if (abs < day) return rtf.format(Math.round(diffMs / hr), 'hour');
  if (abs < week) return rtf.format(Math.round(diffMs / day), 'day');
  if (abs < month) return rtf.format(Math.round(diffMs / week), 'week');
  if (abs < year) return rtf.format(Math.round(diffMs / month), 'month');
  return rtf.format(Math.round(diffMs / year), 'year');
}
