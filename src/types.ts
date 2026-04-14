export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RuleCategory =
  | 'motion' | 'spring' | 'easing' | 'exit' | 'typography' | 'color'
  | 'accessibility' | 'touch' | 'keyboard' | 'focus' | 'loading' | 'error'
  | 'empty' | 'dark-mode' | 'reduced-motion' | 'responsive' | 'layout'
  | 'spacing' | 'scroll' | 'micro' | 'sound' | 'performance' | 'form'
  | 'hierarchy' | 'icon' | 'pseudo' | 'container' | 'modal' | 'navigation'
  | 'table' | 'search' | 'notification' | 'image' | 'button' | 'dataviz'
  | 'i18n' | 'tooltip' | 'state';

export interface RuleViolation {
  rule: string;
  priority: Priority;
  category: RuleCategory;
  message: string;
  fix?: string;
  element?: string;
  line?: number;
}

export interface ContrastResult {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  dampingRatio: number;
  settleTime: number;
}

export interface SpringPreset {
  name: string;
  stiffness: number;
  damping: number;
  mass: number;
}

export interface TimingValidation {
  valid: boolean;
  value: number;
  rule: string;
  min: number;
  max: number;
  message: string;
}

export interface TouchTargetResult {
  width: number;
  height: number;
  valid: boolean;
  minimumSize: number;
  message: string;
}

export type EasingPreset = 'ease-out-enter' | 'ease-in-exit' | 'ease-in-out-morph' | 'deceleration' | 'acceleration' | 'standard';

export interface EasingValue {
  name: string;
  css: string;
  cubicBezier: [number, number, number, number];
  usage: string;
}
