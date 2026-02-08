import { CalculatorInputs } from '@/types';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function encodeInputsToParams(inputs: CalculatorInputs): string {
  const params = new URLSearchParams({
    v: inputs.monthlyVolume.toString(),
    t: inputs.avgTransactionSize.toString(),
    l: inputs.locations.toString(),
    p: inputs.currentProcessor,
    c: inputs.cardPresentPercent.toString(),
  });
  return params.toString();
}

export function decodeParamsToInputs(searchParams: URLSearchParams): Partial<CalculatorInputs> {
  const result: Partial<CalculatorInputs> = {};

  const v = searchParams.get('v');
  if (v) result.monthlyVolume = Number(v);

  const t = searchParams.get('t');
  if (t) result.avgTransactionSize = Number(t);

  const l = searchParams.get('l');
  if (l) result.locations = Number(l);

  const p = searchParams.get('p');
  if (p) result.currentProcessor = p;

  const c = searchParams.get('c');
  if (c) result.cardPresentPercent = Number(c);

  return result;
}

export function trackEvent(event: string, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
  }).catch(() => {
    // Silently fail analytics
  });
}
