import type { SpringConfig, SpringPreset } from '../types';

export const SPRING_PRESETS: Record<string, SpringPreset> = {
  gentle: { name: 'gentle', stiffness: 120, damping: 14, mass: 1 },
  snappy: { name: 'snappy', stiffness: 300, damping: 24, mass: 1 },
  bouncy: { name: 'bouncy', stiffness: 200, damping: 15, mass: 1 },
  slow: { name: 'slow', stiffness: 80, damping: 12, mass: 1 },
};

export function dampingRatio(stiffness: number, damping: number, mass: number = 1): number {
  return damping / (2 * Math.sqrt(stiffness * mass));
}

export function estimateSettleTime(stiffness: number, damping: number, mass: number = 1): number {
  const ratio = dampingRatio(stiffness, damping, mass);
  const omega = Math.sqrt(stiffness / mass);
  if (ratio >= 1) return (4000 / (ratio * omega));
  return ((-Math.log(0.01)) / (ratio * omega)) * 1000;
}

export function analyzeSpring(stiffness: number, damping: number, mass: number = 1): SpringConfig {
  return {
    stiffness, damping, mass,
    dampingRatio: Math.round(dampingRatio(stiffness, damping, mass) * 1000) / 1000,
    settleTime: Math.round(estimateSettleTime(stiffness, damping, mass)),
  };
}

export function validateSpring(stiffness: number, damping: number, mass: number = 1,
  context: 'gesture' | 'structural' | 'playful' | 'dropdown' = 'gesture'
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const ratio = dampingRatio(stiffness, damping, mass);
  const settle = estimateSettleTime(stiffness, damping, mass);
  if (settle > 600) issues.push(`Settle time ${Math.round(settle)}ms exceeds 600ms maximum. Increase stiffness or damping.`);
  if (stiffness < 100 || stiffness > 300) issues.push(`Stiffness ${stiffness} outside recommended 100-300 range.`);
  if (context === 'structural' && ratio < 1) issues.push(`Structural motion requires critically damped spring (ratio >= 1.0). Current ratio: ${ratio.toFixed(2)}`);
  if (context === 'dropdown' && ratio < 1) issues.push(`Dropdowns must not bounce. Use damping ratio >= 1.0. Current: ${ratio.toFixed(2)}`);
  if (context === 'playful' && (ratio < 0.7 || ratio > 0.85)) issues.push(`Playful springs should have damping ratio 0.7-0.85. Current: ${ratio.toFixed(2)}`);
  if (mass > 1.5) issues.push(`Mass ${mass} exceeds 1.5 maximum. Keep mass at 1.0 for most elements.`);
  return { valid: issues.length === 0, issues };
}

export function suggestSpring(context: 'gesture' | 'structural' | 'playful' | 'dropdown' | 'heavy'): SpringPreset {
  switch (context) {
    case 'gesture': return SPRING_PRESETS.snappy;
    case 'structural': return { name: 'structural', stiffness: 250, damping: 32, mass: 1 };
    case 'playful': return SPRING_PRESETS.bouncy;
    case 'dropdown': return { name: 'dropdown', stiffness: 280, damping: 34, mass: 1 };
    case 'heavy': return { name: 'heavy', stiffness: 150, damping: 20, mass: 1.3 };
  }
}
