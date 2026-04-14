import type { TouchTargetResult } from '../types';

export function validateTouchTarget(width: number, height: number, context: 'mobile' | 'desktop' = 'mobile'): TouchTargetResult {
  const min = context === 'mobile' ? 48 : 44;
  const valid = width >= min && height >= min;
  return { width, height, valid, minimumSize: min,
    message: valid ? `OK ${width}x${height}px meets ${min}px minimum`
      : `FAIL ${width}x${height}px below ${min}px minimum. ${width<min?`Width needs +${min-width}px.`:''} ${height<min?`Height needs +${min-height}px.`:''}`.trim() };
}

export function calculateTouchPadding(visualWidth: number, visualHeight: number, minimumTarget: number = 48) {
  const hPad = Math.max(0, Math.ceil((minimumTarget - visualWidth) / 2));
  const vPad = Math.max(0, Math.ceil((minimumTarget - visualHeight) / 2));
  return { top: vPad, right: hPad, bottom: vPad, left: hPad };
}

export function validateTargetSpacing(spacingPx: number) {
  const valid = spacingPx >= 8;
  return { valid, message: valid ? `OK ${spacingPx}px meets 8px minimum` : `FAIL ${spacingPx}px below 8px minimum. Add ${8-spacingPx}px more.` };
}
