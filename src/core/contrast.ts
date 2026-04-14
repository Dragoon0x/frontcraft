import type { ContrastResult } from '../types';

export function parseColor(color: string): [number, number, number] {
  const c = color.trim().toLowerCase();
  const named: Record<string, [number, number, number]> = {
    white: [255, 255, 255], black: [0, 0, 0], red: [255, 0, 0],
    green: [0, 128, 0], blue: [0, 0, 255], transparent: [0, 0, 0],
  };
  if (named[c]) return named[c];
  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    if (hex.length === 4) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
    return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
  }
  const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  throw new Error(`Cannot parse color: ${color}`);
}

export function relativeLuminance(r: number, g: number, b: number): number {
  const [rs,gs,bs] = [r,g,b].map(c => { const s=c/255; return s<=0.04045?s/12.92:Math.pow((s+0.055)/1.055,2.4); });
  return 0.2126*rs + 0.7152*gs + 0.0722*bs;
}

export function contrastRatio(color1: string, color2: string): number {
  const [r1,g1,b1]=parseColor(color1); const [r2,g2,b2]=parseColor(color2);
  const l1=relativeLuminance(r1,g1,b1); const l2=relativeLuminance(r2,g2,b2);
  return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
}

export function checkContrast(fg: string, bg: string): ContrastResult {
  const r = contrastRatio(fg, bg);
  return { ratio: Math.round(r*100)/100, aa: r>=4.5, aaa: r>=7, aaLarge: r>=3, aaaLarge: r>=4.5 };
}

export function checkUIComponentContrast(comp: string, adj: string): boolean {
  return contrastRatio(comp, adj) >= 3;
}

export function checkFocusContrast(focus: string, bg: string, unfocused: string) {
  const bgR=contrastRatio(focus,bg); const elR=contrastRatio(focus,unfocused);
  return { passesBackground: bgR>=3, passesElement: elR>=3, valid: bgR>=3 && elR>=3 };
}

export function suggestTextColor(bg: string): '#000000'|'#ffffff' {
  const [r,g,b]=parseColor(bg); return relativeLuminance(r,g,b)>0.179?'#000000':'#ffffff';
}

export function minimumOpacityForAA(text: string, bg: string): number {
  const [tr,tg,tb]=parseColor(text); const [br,bg2,bb]=parseColor(bg);
  for (let o=10;o<=100;o++) {
    const a=o/100;
    const mixed=`rgb(${Math.round(tr*a+br*(1-a))},${Math.round(tg*a+bg2*(1-a))},${Math.round(tb*a+bb*(1-a))})`;
    if (contrastRatio(mixed,bg)>=4.5) return a;
  }
  return 1;
}
