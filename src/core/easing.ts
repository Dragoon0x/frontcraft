import type { EasingPreset, EasingValue } from '../types';

export const EASING_PRESETS: Record<EasingPreset, EasingValue> = {
  'ease-out-enter': { name: 'Entrance (ease-out)', css: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)', cubicBezier: [0.0, 0.0, 0.2, 1.0], usage: 'Elements entering the screen.' },
  'ease-in-exit': { name: 'Exit (ease-in)', css: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)', cubicBezier: [0.4, 0.0, 1.0, 1.0], usage: 'Elements leaving the screen.' },
  'ease-in-out-morph': { name: 'Morph (ease-in-out)', css: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)', cubicBezier: [0.4, 0.0, 0.2, 1.0], usage: 'Shape/position morphing.' },
  deceleration: { name: 'Deceleration', css: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)', cubicBezier: [0.0, 0.0, 0.2, 1.0], usage: 'Elements entering from outside viewport.' },
  acceleration: { name: 'Acceleration', css: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)', cubicBezier: [0.4, 0.0, 1.0, 1.0], usage: 'Elements leaving screen permanently.' },
  standard: { name: 'Standard', css: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)', cubicBezier: [0.4, 0.0, 0.2, 1.0], usage: 'Elements changing position/size on screen.' },
};

export function getEasing(context: 'enter' | 'exit' | 'morph' | 'enter-from-outside' | 'leave-screen'): EasingValue {
  switch (context) {
    case 'enter': return EASING_PRESETS['ease-out-enter'];
    case 'exit': return EASING_PRESETS['ease-in-exit'];
    case 'morph': return EASING_PRESETS['ease-in-out-morph'];
    case 'enter-from-outside': return EASING_PRESETS.deceleration;
    case 'leave-screen': return EASING_PRESETS.acceleration;
  }
}

export function validateBezier(p1x: number, p1y: number, p2x: number, p2y: number): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (p1x === 0 && p1y === 0 && p2x === 1 && p2y === 1) issues.push('Linear easing should not be used for UI transitions. Only for spinners and progress bars.');
  if ([p1x, p1y, p2x, p2y].some(p => p > 1.5 || p < -0.5)) issues.push(`Control points should stay within [-0.5, 1.5]. Values: (${p1x}, ${p1y}, ${p2x}, ${p2y})`);
  return { valid: issues.length === 0, issues };
}

export function generateEasingTokens(): string {
  const lines = Object.entries(EASING_PRESETS).map(([key, val]) => `  --easing-${key}: ${val.css};`);
  return `:root {\n${lines.join('\n')}\n}`;
}
