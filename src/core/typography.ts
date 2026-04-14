export const TYPE_SCALE_RATIOS = {
  minorThird: { name: 'Minor Third', ratio: 1.2, usage: 'Compact UIs' },
  majorThird: { name: 'Major Third', ratio: 1.25, usage: 'General use' },
  perfectFourth: { name: 'Perfect Fourth', ratio: 1.333, usage: 'Editorial / marketing' },
  augmentedFourth: { name: 'Augmented Fourth', ratio: 1.414, usage: 'High contrast hierarchy' },
  goldenRatio: { name: 'Golden Ratio', ratio: 1.618, usage: 'Dramatic hierarchy' },
} as const;

export function generateTypeScale(basePx: number = 16, ratio: number = 1.25, steps: number = 8) {
  const names = ['xs', 'sm', 'body', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
  const startIndex = -2;
  return Array.from({ length: steps }, (_, i) => {
    const step = startIndex + i;
    const size = Math.round(basePx * Math.pow(ratio, step) * 100) / 100;
    const rem = `${(size / 16).toFixed(3)}rem`;
    const lineHeight = step <= 0 ? 1.5 : step <= 2 ? 1.3 : 1.15;
    return { name: names[i] || `step-${i}`, size, rem, lineHeight };
  });
}

export function responsiveClamp(minPx: number, maxPx: number, minVw: number = 320, maxVw: number = 1440): string {
  const minRem = minPx / 16; const maxRem = maxPx / 16;
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const intercept = minPx - slope * minVw;
  return `clamp(${minRem.toFixed(3)}rem, ${(intercept/16).toFixed(3)}rem + ${(slope*100).toFixed(3)}vw, ${maxRem.toFixed(3)}rem)`;
}

export function validateMeasure(characters: number) {
  const valid = characters >= 45 && characters <= 75;
  return { valid, message: valid ? `OK ${characters} chars within 45-75` : characters < 45 ? `FAIL ${characters} too narrow (min 45)` : `FAIL ${characters} too wide (max 75, use max-width: 65ch)` };
}

export function validateBaseFontSize(sizePx: number) {
  const valid = sizePx >= 16;
  return { valid, message: valid ? `OK ${sizePx}px meets 16px minimum` : `FAIL ${sizePx}px below 16px minimum` };
}

export function validateLineHeight(lh: number, context: 'body' | 'heading' = 'body') {
  const [min, max] = context === 'body' ? [1.4, 1.6] : [1.1, 1.3];
  const valid = lh >= min && lh <= max;
  return { valid, message: valid ? `OK ${lh} within ${context} range (${min}-${max})` : `FAIL ${lh} outside ${context} range (${min}-${max})` };
}

export function systemFontStack(): string {
  return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
}

export function generateTypeTokens(basePx: number = 16, ratio: number = 1.25): string {
  const scale = generateTypeScale(basePx, ratio);
  const sizes = scale.map(s => `  --font-size-${s.name}: ${s.rem};`);
  const lhs = scale.map(s => `  --line-height-${s.name}: ${s.lineHeight};`);
  return `:root {\n${sizes.join('\n')}\n\n${lhs.join('\n')}\n}`;
}
