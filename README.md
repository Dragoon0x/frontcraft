# frontcraft

The Frontend Craft Specification. 324 rules across 20 categories. Every rule has a name, a priority, and a measurable threshold.

No opinions without numbers. No principles without proof.

## Install the Agent Skill

```bash
npx skills add Dragoon0x/frontcraft
```

Works with Claude Code, Cursor, Codex, Windsurf, and 15+ other AI coding agents.

## Install the npm Package

```bash
npm install frontcraft
```

TypeScript utilities that implement the rules programmatically: color contrast checking, timing validation, spring physics analysis, typography scale generation, spacing system helpers, and touch target compliance.

## What's Inside

**20 categories. 324 rules. 65 Critical. 152 High. 98 Medium. 9 Low.**

| Category | Rules | Category | Rules |
|---|---|---|---|
| Motion & Timing | 26 | Loading States | 13 |
| Typography | 25 | Error States | 14 |
| Accessibility | 35 | Dark Mode | 12 |
| Color & Contrast | 20 | Keyboard Navigation | 10 |
| Touch & Interaction | 20 | Sound Design | 8 |
| Layout & Spacing | 19 | Micro-interactions | 15 |
| Responsive Design | 16 | Forms & Input | 15 |
| Performance | 24 | Navigation | 12 |
| Icons & Imagery | 11 | Scroll Behavior | 9 |
| Content & Copy | 10 | Performance Perception | 10 |

## Rule Format

Every rule follows this structure:

```
### rule-name
**Priority**: CRITICAL | HIGH | MEDIUM | LOW
**Threshold**: A measurable number, not a vague recommendation
\`\`\`code
// Production-ready implementation
\`\`\`
```

When the agent finds violations, it reports:

```
motion-duration-cap | CRITICAL | src/Button.tsx:42 | Transition 800ms exceeds 500ms cap | Use 200ms ease-out
```

## npm Package Usage

```typescript
import {
  checkContrast,
  validateTiming,
  analyzeSpring,
  generateTypeScale,
  validateTouchTarget,
  responsiveClamp,
} from 'frontcraft';

// Check WCAG contrast compliance
const result = checkContrast('#333', '#fff');
// { ratio: 12.63, aa: true, aaa: true, aaLarge: true, aaaLarge: true }

// Validate animation timing
const timing = validateTiming('fadeIn', 150);
// { valid: true, value: 150, rule: 'timing-fadeIn', min: 120, max: 180 }

// Analyze spring configuration
const spring = analyzeSpring(200, 20);
// { stiffness: 200, damping: 20, mass: 1, dampingRatio: 0.707, settleTime: 326 }

// Generate responsive typography
const clamp = responsiveClamp(16, 24);
// 'clamp(1.000rem, 0.571rem + 0.714vw, 1.500rem)'

// Validate touch targets
const touch = validateTouchTarget(36, 36, 'mobile');
// { valid: false, minimumSize: 48, message: '...' }
```

## Utilities

**Color & Contrast**: `checkContrast`, `contrastRatio`, `checkUIComponentContrast`, `checkFocusContrast`, `suggestTextColor`, `minimumOpacityForAA`

**Timing**: `validateTiming`, `validateExitFasterThanEnter`, `calculateStagger`, `getTimingThresholds`

**Spring Physics**: `analyzeSpring`, `validateSpring`, `suggestSpring`, `dampingRatio`, `estimateSettleTime`, `SPRING_PRESETS`

**Easing**: `getEasing`, `validateBezier`, `generateEasingTokens`, `EASING_PRESETS`

**Typography**: `generateTypeScale`, `responsiveClamp`, `validateMeasure`, `validateBaseFontSize`, `validateLineHeight`, `systemFontStack`, `generateTypeTokens`

**Touch**: `validateTouchTarget`, `calculateTouchPadding`, `validateTargetSpacing`

**Spacing**: `isOnScale`, `nearestScaleValue`, `validateInternalExternal`, `generateSpacingTokens`, `validateSectionSpacing`, `SPACING_TOKENS`

## Contributing

Open an issue or PR. New rules must follow the format:

1. Unique kebab-case name
2. CRITICAL, HIGH, MEDIUM, or LOW priority
3. A measurable threshold (a number, a ratio, a pixel value)
4. Production code showing pass/fail

## DISCLAIMER

This project is experimental and provided as-is. Do your own research (DYOR). Rules are based on widely accepted standards (WCAG, Material Design, Nielsen Norman Group research, Apple HIG) but specific thresholds may need adjustment for your context.

## License

MIT — [Dragoon0x](https://github.com/Dragoon0x)
