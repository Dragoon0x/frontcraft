import type { TimingValidation } from '../types';

const THRESHOLDS: Record<string, [number, number, string]> = {
  response: [0, 100, 'Visual feedback for user input must appear within 100ms'],
  micro: [0, 200, 'Micro-interactions must complete within 200ms'],
  fadeIn: [120, 180, 'Fade-in transitions should be 120-180ms'],
  fadeOut: [80, 120, 'Fade-out transitions should be 80-120ms'],
  modalEnter: [200, 300, 'Modal entrance should be 200-300ms'],
  modalExit: [150, 200, 'Modal exit should be 150-200ms'],
  hover: [0, 0, 'Hover transitions should have 0ms delay'],
  hoverExit: [50, 150, 'Hover exit delay should be 50-150ms'],
  stagger: [30, 50, 'Stagger delay per item should be 30-50ms'],
  tooltip: [200, 400, 'Tooltip show delay should be 200-400ms'],
  debounceInput: [150, 300, 'Input debounce should be 150-300ms'],
  spinnerDelay: [300, 300, 'Spinner display delay should be 300ms'],
  toastDuration: [4000, 6000, 'Toast auto-dismiss should be 4-6 seconds'],
  skeletonShimmer: [1200, 1800, 'Skeleton shimmer cycle should be 1200-1800ms'],
  carouselAutoplay: [4000, 6000, 'Carousel auto-advance should be 4-6 seconds'],
  animation: [0, 400, 'No single UI animation should exceed 400ms'],
  longPress: [400, 600, 'Long press should trigger after 400-600ms'],
};

export function validateTiming(type: keyof typeof THRESHOLDS, valueMs: number): TimingValidation {
  const [min, max, desc] = THRESHOLDS[type];
  const valid = valueMs >= min && valueMs <= max;
  return { valid, value: valueMs, rule: `timing-${type}`, min, max,
    message: valid ? `OK ${valueMs}ms within ${min}-${max}ms` : `FAIL ${valueMs}ms outside ${min}-${max}ms. ${desc}` };
}

export function validateExitFasterThanEnter(enterMs: number, exitMs: number): TimingValidation {
  const ratio = exitMs / enterMs;
  const valid = ratio >= 0.6 && ratio <= 0.75;
  return { valid, value: exitMs, rule: 'exit-faster-than-enter', min: Math.round(enterMs*0.6), max: Math.round(enterMs*0.75),
    message: valid ? `OK Exit ${exitMs}ms is ${Math.round((1-ratio)*100)}% faster than enter ${enterMs}ms`
      : `FAIL Exit should be 25-40% faster. Enter: ${enterMs}ms, expected exit ${Math.round(enterMs*0.6)}-${Math.round(enterMs*0.75)}ms, got ${exitMs}ms` };
}

export function calculateStagger(itemCount: number, delayPerItem: number = 40) {
  const maxItems = Math.min(itemCount, 12);
  const totalDuration = maxItems * delayPerItem;
  const capped = totalDuration > 500;
  const adjustedDelay = capped ? Math.floor(500 / maxItems) : delayPerItem;
  return { animatedItems: maxItems, totalDuration: Math.min(totalDuration, 500), capped, delayPerItem: adjustedDelay };
}

export function getTimingThresholds(): Record<string, { min: number; max: number; description: string }> {
  const result: Record<string, { min: number; max: number; description: string }> = {};
  for (const [key, [min, max, desc]] of Object.entries(THRESHOLDS)) {
    result[key] = { min, max, description: desc };
  }
  return result;
}
