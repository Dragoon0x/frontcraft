export const SPACING_SCALE = [0,1,2,3,4,5,6,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96] as const;

export const SPACING_TOKENS: Record<string, number> = {
  '0':0,'px':1,'0.5':2,'1':4,'1.5':6,'2':8,'2.5':10,'3':12,'3.5':14,
  '4':16,'5':20,'6':24,'7':28,'8':32,'10':40,'12':48,'14':56,'16':64,'20':80,'24':96,
};

export function isOnScale(valuePx: number): boolean { return valuePx % 4 === 0 || valuePx <= 2; }

export function nearestScaleValue(valuePx: number): number {
  let closest: number = SPACING_SCALE[0]; let minDiff = Infinity;
  for (const v of SPACING_SCALE) { const d = Math.abs(v - valuePx); if (d < minDiff) { minDiff = d; closest = v; } }
  return closest;
}

export function validateInternalExternal(internal: number, external: number) {
  const valid = internal <= external;
  return { valid, message: valid ? `OK internal (${internal}px) <= external (${external}px)` : `FAIL internal (${internal}px) should be <= external (${external}px)` };
}

export function generateSpacingTokens(): string {
  const lines = Object.entries(SPACING_TOKENS).map(([k,v]) => `  --space-${k}: ${v}px;`);
  return `:root {\n${lines.join('\n')}\n}`;
}

export function validateSectionSpacing(spacingPx: number) {
  const valid = spacingPx >= 48 && spacingPx <= 96;
  return { valid, message: valid ? `OK section spacing ${spacingPx}px within 48-96px` : `FAIL section spacing ${spacingPx}px outside 48-96px. ${spacingPx<48?'Too cramped.':'Too spread out.'}` };
}
