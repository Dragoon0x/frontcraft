// frontcraft test suite
// Run: node test/run.js

const assert = (condition, message) => {
  if (!condition) throw new Error(`FAIL: ${message}`);
};

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

// ─── Contrast Tests ───

test('parseColor: hex 3-digit', () => {
  const { parseColor } = require('../dist/index.js');
  const [r, g, b] = parseColor('#fff');
  assert(r === 255 && g === 255 && b === 255, `Expected [255,255,255], got [${r},${g},${b}]`);
});

test('parseColor: hex 6-digit', () => {
  const { parseColor } = require('../dist/index.js');
  const [r, g, b] = parseColor('#1a1a1a');
  assert(r === 26 && g === 26 && b === 26, `Expected [26,26,26], got [${r},${g},${b}]`);
});

test('parseColor: rgb()', () => {
  const { parseColor } = require('../dist/index.js');
  const [r, g, b] = parseColor('rgb(100, 200, 50)');
  assert(r === 100 && g === 200 && b === 50, `Expected [100,200,50], got [${r},${g},${b}]`);
});

test('parseColor: rgba()', () => {
  const { parseColor } = require('../dist/index.js');
  const [r, g, b] = parseColor('rgba(100, 200, 50, 0.5)');
  assert(r === 100 && g === 200 && b === 50, `Got [${r},${g},${b}]`);
});

test('parseColor: named white', () => {
  const { parseColor } = require('../dist/index.js');
  const [r, g, b] = parseColor('white');
  assert(r === 255 && g === 255 && b === 255, `Got [${r},${g},${b}]`);
});

test('parseColor: named black', () => {
  const { parseColor } = require('../dist/index.js');
  const [r, g, b] = parseColor('black');
  assert(r === 0 && g === 0 && b === 0, `Got [${r},${g},${b}]`);
});

test('parseColor: throws on invalid', () => {
  const { parseColor } = require('../dist/index.js');
  let threw = false;
  try { parseColor('notacolor'); } catch { threw = true; }
  assert(threw, 'Should throw on invalid color');
});

test('relativeLuminance: white = ~1.0', () => {
  const { relativeLuminance } = require('../dist/index.js');
  const l = relativeLuminance(255, 255, 255);
  assert(Math.abs(l - 1.0) < 0.001, `Expected ~1.0, got ${l}`);
});

test('relativeLuminance: black = 0', () => {
  const { relativeLuminance } = require('../dist/index.js');
  const l = relativeLuminance(0, 0, 0);
  assert(l === 0, `Expected 0, got ${l}`);
});

test('contrastRatio: black on white = 21', () => {
  const { contrastRatio } = require('../dist/index.js');
  const r = contrastRatio('#000', '#fff');
  assert(Math.abs(r - 21) < 0.1, `Expected 21, got ${r}`);
});

test('contrastRatio: same color = 1', () => {
  const { contrastRatio } = require('../dist/index.js');
  const r = contrastRatio('#888', '#888');
  assert(Math.abs(r - 1) < 0.01, `Expected 1, got ${r}`);
});

test('checkContrast: black on white passes all', () => {
  const { checkContrast } = require('../dist/index.js');
  const result = checkContrast('#000', '#fff');
  assert(result.aa === true, 'Should pass AA');
  assert(result.aaa === true, 'Should pass AAA');
  assert(result.aaLarge === true, 'Should pass AA Large');
  assert(result.aaaLarge === true, 'Should pass AAA Large');
});

test('checkContrast: gray on white fails AA', () => {
  const { checkContrast } = require('../dist/index.js');
  const result = checkContrast('#999', '#fff');
  assert(result.aa === false, `Should fail AA, ratio: ${result.ratio}`);
});

test('checkContrast: dark gray on white passes AA', () => {
  const { checkContrast } = require('../dist/index.js');
  const result = checkContrast('#595959', '#fff');
  assert(result.aa === true, `Should pass AA, ratio: ${result.ratio}`);
});

test('checkUIComponentContrast: 3:1 boundary', () => {
  const { checkUIComponentContrast, contrastRatio } = require('../dist/index.js');
  // #767676 on white is exactly ~4.54:1
  assert(checkUIComponentContrast('#767676', '#fff') === true, 'Should pass 3:1');
  // Very light gray fails
  assert(checkUIComponentContrast('#ccc', '#fff') === false, 'Should fail 3:1');
});

test('checkFocusContrast: valid focus ring', () => {
  const { checkFocusContrast } = require('../dist/index.js');
  const result = checkFocusContrast('#0000ff', '#ffffff', '#cccccc');
  assert(result.valid === true, `Focus ring should pass both checks. BG: ${result.passesBackground}, El: ${result.passesElement}`);
});

test('suggestTextColor: light background → black', () => {
  const { suggestTextColor } = require('../dist/index.js');
  assert(suggestTextColor('#ffffff') === '#000000', 'White bg → black text');
  assert(suggestTextColor('#f0f0f0') === '#000000', 'Light gray bg → black text');
});

test('suggestTextColor: dark background → white', () => {
  const { suggestTextColor } = require('../dist/index.js');
  assert(suggestTextColor('#000000') === '#ffffff', 'Black bg → white text');
  assert(suggestTextColor('#1a1a1a') === '#ffffff', 'Dark bg → white text');
});

test('minimumOpacityForAA: white text on dark bg', () => {
  const { minimumOpacityForAA } = require('../dist/index.js');
  const opacity = minimumOpacityForAA('#ffffff', '#1a1a1a');
  assert(opacity <= 0.5, `Expected low opacity needed, got ${opacity}`);
});

// ─── Timing Tests ───

test('validateTiming: response within 100ms', () => {
  const { validateTiming } = require('../dist/index.js');
  assert(validateTiming('response', 50).valid === true, '50ms should pass');
  assert(validateTiming('response', 150).valid === false, '150ms should fail');
});

test('validateTiming: micro under 200ms', () => {
  const { validateTiming } = require('../dist/index.js');
  assert(validateTiming('micro', 150).valid === true, '150ms should pass');
  assert(validateTiming('micro', 250).valid === false, '250ms should fail');
});

test('validateTiming: fadeIn 120-180ms', () => {
  const { validateTiming } = require('../dist/index.js');
  assert(validateTiming('fadeIn', 150).valid === true, '150ms should pass');
  assert(validateTiming('fadeIn', 50).valid === false, '50ms should fail');
  assert(validateTiming('fadeIn', 250).valid === false, '250ms should fail');
});

test('validateTiming: fadeOut 80-120ms', () => {
  const { validateTiming } = require('../dist/index.js');
  assert(validateTiming('fadeOut', 100).valid === true, '100ms should pass');
  assert(validateTiming('fadeOut', 200).valid === false, '200ms should fail');
});

test('validateTiming: modalEnter 200-300ms', () => {
  const { validateTiming } = require('../dist/index.js');
  assert(validateTiming('modalEnter', 250).valid === true, '250ms pass');
  assert(validateTiming('modalEnter', 500).valid === false, '500ms fail');
});

test('validateTiming: modalExit 150-200ms', () => {
  const { validateTiming } = require('../dist/index.js');
  assert(validateTiming('modalExit', 175).valid === true, '175ms pass');
});

test('validateTiming: animation max 400ms', () => {
  const { validateTiming } = require('../dist/index.js');
  assert(validateTiming('animation', 300).valid === true, '300ms pass');
  assert(validateTiming('animation', 500).valid === false, '500ms fail');
});

test('validateTiming: toastDuration 4-6s', () => {
  const { validateTiming } = require('../dist/index.js');
  assert(validateTiming('toastDuration', 5000).valid === true, '5s pass');
  assert(validateTiming('toastDuration', 2000).valid === false, '2s fail');
});

test('validateTiming: debounceInput 150-300ms', () => {
  const { validateTiming } = require('../dist/index.js');
  assert(validateTiming('debounceInput', 200).valid === true, '200ms pass');
  assert(validateTiming('debounceInput', 50).valid === false, '50ms fail');
});

test('validateExitFasterThanEnter: valid ratio', () => {
  const { validateExitFasterThanEnter } = require('../dist/index.js');
  const result = validateExitFasterThanEnter(300, 200);
  assert(result.valid === true, `200ms exit for 300ms enter should be valid. Got: ${result.message}`);
});

test('validateExitFasterThanEnter: exit too slow', () => {
  const { validateExitFasterThanEnter } = require('../dist/index.js');
  const result = validateExitFasterThanEnter(300, 280);
  assert(result.valid === false, 'Exit nearly equal to enter should fail');
});

test('validateExitFasterThanEnter: exit too fast', () => {
  const { validateExitFasterThanEnter } = require('../dist/index.js');
  const result = validateExitFasterThanEnter(300, 100);
  assert(result.valid === false, 'Exit much faster than enter should fail');
});

test('calculateStagger: small list', () => {
  const { calculateStagger } = require('../dist/index.js');
  const result = calculateStagger(5, 40);
  assert(result.animatedItems === 5, `Expected 5 items, got ${result.animatedItems}`);
  assert(result.totalDuration === 200, `Expected 200ms, got ${result.totalDuration}`);
  assert(result.capped === false, 'Should not be capped');
});

test('calculateStagger: large list caps at 12', () => {
  const { calculateStagger } = require('../dist/index.js');
  const result = calculateStagger(50, 40);
  assert(result.animatedItems === 12, `Expected 12 items, got ${result.animatedItems}`);
});

test('calculateStagger: total capped at 500ms', () => {
  const { calculateStagger } = require('../dist/index.js');
  const result = calculateStagger(20, 50);
  assert(result.totalDuration <= 500, `Expected ≤500ms, got ${result.totalDuration}`);
  assert(result.capped === true, 'Should be capped');
});

test('getTimingThresholds: returns all thresholds', () => {
  const { getTimingThresholds } = require('../dist/index.js');
  const t = getTimingThresholds();
  assert(t.response !== undefined, 'Should have response');
  assert(t.micro !== undefined, 'Should have micro');
  assert(t.fadeIn !== undefined, 'Should have fadeIn');
  assert(t.animation !== undefined, 'Should have animation');
  assert(typeof t.response.min === 'number', 'min should be number');
  assert(typeof t.response.max === 'number', 'max should be number');
});

// ─── Spring Tests ───

test('dampingRatio: critically damped', () => {
  const { dampingRatio } = require('../dist/index.js');
  // For critically damped: damping = 2 * sqrt(stiffness * mass)
  const stiffness = 100;
  const d = 2 * Math.sqrt(stiffness);
  const ratio = dampingRatio(stiffness, d);
  assert(Math.abs(ratio - 1.0) < 0.01, `Expected ~1.0, got ${ratio}`);
});

test('dampingRatio: underdamped', () => {
  const { dampingRatio } = require('../dist/index.js');
  const ratio = dampingRatio(200, 15);
  assert(ratio < 1, `Expected < 1, got ${ratio}`);
});

test('dampingRatio: overdamped', () => {
  const { dampingRatio } = require('../dist/index.js');
  const ratio = dampingRatio(100, 30);
  assert(ratio > 1, `Expected > 1, got ${ratio}`);
});

test('analyzeSpring: returns all properties', () => {
  const { analyzeSpring } = require('../dist/index.js');
  const config = analyzeSpring(200, 20);
  assert(config.stiffness === 200, 'stiffness');
  assert(config.damping === 20, 'damping');
  assert(config.mass === 1, 'mass');
  assert(typeof config.dampingRatio === 'number', 'dampingRatio');
  assert(typeof config.settleTime === 'number', 'settleTime');
});

test('validateSpring: valid gesture spring', () => {
  const { validateSpring } = require('../dist/index.js');
  const result = validateSpring(200, 20, 1, 'gesture');
  assert(result.valid === true, `Expected valid. Issues: ${result.issues.join(', ')}`);
});

test('validateSpring: bouncy spring fails structural', () => {
  const { validateSpring } = require('../dist/index.js');
  const result = validateSpring(200, 15, 1, 'structural');
  assert(result.valid === false, 'Bouncy spring should fail for structural context');
  assert(result.issues.some(i => i.includes('critically damped')), 'Should mention critically damped');
});

test('validateSpring: bouncy spring fails dropdown', () => {
  const { validateSpring } = require('../dist/index.js');
  const result = validateSpring(200, 15, 1, 'dropdown');
  assert(result.valid === false, 'Bouncy spring should fail for dropdown');
});

test('validateSpring: high mass warns', () => {
  const { validateSpring } = require('../dist/index.js');
  const result = validateSpring(200, 20, 2.0, 'gesture');
  assert(result.issues.some(i => i.includes('Mass')), 'Should warn about mass');
});

test('validateSpring: out of stiffness range warns', () => {
  const { validateSpring } = require('../dist/index.js');
  const result = validateSpring(50, 10, 1, 'gesture');
  assert(result.issues.some(i => i.includes('Stiffness')), 'Should warn about stiffness');
});

test('SPRING_PRESETS: has all presets', () => {
  const { SPRING_PRESETS } = require('../dist/index.js');
  assert(SPRING_PRESETS.gentle !== undefined, 'Should have gentle');
  assert(SPRING_PRESETS.snappy !== undefined, 'Should have snappy');
  assert(SPRING_PRESETS.bouncy !== undefined, 'Should have bouncy');
  assert(SPRING_PRESETS.slow !== undefined, 'Should have slow');
});

test('suggestSpring: returns correct context', () => {
  const { suggestSpring } = require('../dist/index.js');
  const gesture = suggestSpring('gesture');
  assert(gesture.stiffness === 300, 'Gesture should be snappy (300)');
  const structural = suggestSpring('structural');
  assert(structural.stiffness === 250, `Structural stiffness should be 250, got ${structural.stiffness}`);
});

test('estimateSettleTime: reasonable range', () => {
  const { estimateSettleTime } = require('../dist/index.js');
  const settle = estimateSettleTime(200, 20);
  assert(settle > 0 && settle < 2000, `Settle time should be reasonable, got ${settle}ms`);
});

// ─── Easing Tests ───

test('EASING_PRESETS: has all presets', () => {
  const { EASING_PRESETS } = require('../dist/index.js');
  assert(EASING_PRESETS['ease-out-enter'] !== undefined, 'Should have ease-out-enter');
  assert(EASING_PRESETS['ease-in-exit'] !== undefined, 'Should have ease-in-exit');
  assert(EASING_PRESETS['ease-in-out-morph'] !== undefined, 'Should have ease-in-out-morph');
  assert(EASING_PRESETS.standard !== undefined, 'Should have standard');
});

test('getEasing: returns correct context', () => {
  const { getEasing } = require('../dist/index.js');
  const enter = getEasing('enter');
  assert(enter.css.includes('0.0, 0.0, 0.2, 1.0'), `Enter should be ease-out: ${enter.css}`);
  const exit = getEasing('exit');
  assert(exit.css.includes('0.4, 0.0, 1.0, 1.0'), `Exit should be ease-in: ${exit.css}`);
});

test('validateBezier: rejects linear', () => {
  const { validateBezier } = require('../dist/index.js');
  const result = validateBezier(0, 0, 1, 1);
  assert(result.valid === false, 'Linear should fail');
  assert(result.issues.some(i => i.includes('Linear')), 'Should mention linear');
});

test('validateBezier: rejects extreme values', () => {
  const { validateBezier } = require('../dist/index.js');
  const result = validateBezier(0, 2.0, 1, -1.0);
  assert(result.valid === false, 'Extreme values should fail');
});

test('validateBezier: accepts standard curve', () => {
  const { validateBezier } = require('../dist/index.js');
  const result = validateBezier(0.4, 0.0, 0.2, 1.0);
  assert(result.valid === true, 'Standard curve should pass');
});

test('generateEasingTokens: produces CSS', () => {
  const { generateEasingTokens } = require('../dist/index.js');
  const css = generateEasingTokens();
  assert(css.includes(':root'), 'Should have :root');
  assert(css.includes('--easing-'), 'Should have --easing- custom properties');
  assert(css.includes('cubic-bezier'), 'Should have cubic-bezier values');
});

// ─── Typography Tests ───

test('generateTypeScale: produces correct number of steps', () => {
  const { generateTypeScale } = require('../dist/index.js');
  const scale = generateTypeScale(16, 1.25, 8);
  assert(scale.length === 8, `Expected 8 steps, got ${scale.length}`);
});

test('generateTypeScale: base is 16px', () => {
  const { generateTypeScale } = require('../dist/index.js');
  const scale = generateTypeScale(16, 1.25, 8);
  const body = scale.find(s => s.name === 'body');
  assert(body !== undefined, 'Should have body step');
  assert(Math.abs(body.size - 16) < 0.1, `Body should be ~16px, got ${body.size}`);
});

test('generateTypeScale: sizes increase', () => {
  const { generateTypeScale } = require('../dist/index.js');
  const scale = generateTypeScale(16, 1.25, 8);
  for (let i = 1; i < scale.length; i++) {
    assert(scale[i].size > scale[i - 1].size, `Step ${i} should be larger than step ${i - 1}`);
  }
});

test('responsiveClamp: produces valid clamp', () => {
  const { responsiveClamp } = require('../dist/index.js');
  const clamp = responsiveClamp(16, 24);
  assert(clamp.startsWith('clamp('), `Should start with clamp(, got: ${clamp}`);
  assert(clamp.includes('rem'), 'Should contain rem');
  assert(clamp.includes('vw'), 'Should contain vw');
});

test('validateMeasure: 65 chars passes', () => {
  const { validateMeasure } = require('../dist/index.js');
  assert(validateMeasure(65).valid === true, '65 should pass');
});

test('validateMeasure: 30 chars fails', () => {
  const { validateMeasure } = require('../dist/index.js');
  assert(validateMeasure(30).valid === false, '30 should fail (too narrow)');
});

test('validateMeasure: 100 chars fails', () => {
  const { validateMeasure } = require('../dist/index.js');
  assert(validateMeasure(100).valid === false, '100 should fail (too wide)');
});

test('validateBaseFontSize: 16px passes', () => {
  const { validateBaseFontSize } = require('../dist/index.js');
  assert(validateBaseFontSize(16).valid === true, '16px should pass');
});

test('validateBaseFontSize: 14px fails', () => {
  const { validateBaseFontSize } = require('../dist/index.js');
  assert(validateBaseFontSize(14).valid === false, '14px should fail');
});

test('validateLineHeight: 1.5 passes body', () => {
  const { validateLineHeight } = require('../dist/index.js');
  assert(validateLineHeight(1.5, 'body').valid === true, '1.5 body should pass');
});

test('validateLineHeight: 1.0 fails body', () => {
  const { validateLineHeight } = require('../dist/index.js');
  assert(validateLineHeight(1.0, 'body').valid === false, '1.0 body should fail');
});

test('validateLineHeight: 1.2 passes heading', () => {
  const { validateLineHeight } = require('../dist/index.js');
  assert(validateLineHeight(1.2, 'heading').valid === true, '1.2 heading should pass');
});

test('systemFontStack: returns string with system-ui', () => {
  const { systemFontStack } = require('../dist/index.js');
  const stack = systemFontStack();
  assert(stack.includes('system-ui'), 'Should include system-ui');
  assert(stack.includes('Segoe UI'), 'Should include Segoe UI');
});

test('generateTypeTokens: produces CSS', () => {
  const { generateTypeTokens } = require('../dist/index.js');
  const css = generateTypeTokens();
  assert(css.includes(':root'), 'Should have :root');
  assert(css.includes('--font-size-'), 'Should have font-size tokens');
  assert(css.includes('--line-height-'), 'Should have line-height tokens');
});

// ─── Touch Tests ───

test('validateTouchTarget: 48px passes mobile', () => {
  const { validateTouchTarget } = require('../dist/index.js');
  assert(validateTouchTarget(48, 48, 'mobile').valid === true, '48x48 should pass');
});

test('validateTouchTarget: 32px fails mobile', () => {
  const { validateTouchTarget } = require('../dist/index.js');
  assert(validateTouchTarget(32, 32, 'mobile').valid === false, '32x32 should fail');
});

test('validateTouchTarget: 44px passes desktop', () => {
  const { validateTouchTarget } = require('../dist/index.js');
  assert(validateTouchTarget(44, 44, 'desktop').valid === true, '44x44 should pass desktop');
});

test('validateTouchTarget: 44px fails mobile', () => {
  const { validateTouchTarget } = require('../dist/index.js');
  assert(validateTouchTarget(44, 44, 'mobile').valid === false, '44x44 should fail mobile (need 48)');
});

test('calculateTouchPadding: small icon', () => {
  const { calculateTouchPadding } = require('../dist/index.js');
  const pad = calculateTouchPadding(24, 24);
  assert(pad.top === 12, `Expected 12px top padding, got ${pad.top}`);
  assert(pad.left === 12, `Expected 12px left padding, got ${pad.left}`);
});

test('calculateTouchPadding: already large enough', () => {
  const { calculateTouchPadding } = require('../dist/index.js');
  const pad = calculateTouchPadding(48, 48);
  assert(pad.top === 0, 'No padding needed');
  assert(pad.left === 0, 'No padding needed');
});

test('validateTargetSpacing: 8px passes', () => {
  const { validateTargetSpacing } = require('../dist/index.js');
  assert(validateTargetSpacing(8).valid === true, '8px should pass');
});

test('validateTargetSpacing: 4px fails', () => {
  const { validateTargetSpacing } = require('../dist/index.js');
  assert(validateTargetSpacing(4).valid === false, '4px should fail');
});

// ─── Spacing Tests ───

test('isOnScale: 16 is on scale', () => {
  const { isOnScale } = require('../dist/index.js');
  assert(isOnScale(16) === true, '16 should be on scale');
});

test('isOnScale: 15 is off scale', () => {
  const { isOnScale } = require('../dist/index.js');
  assert(isOnScale(15) === false, '15 should be off scale');
});

test('isOnScale: 0 is on scale', () => {
  const { isOnScale } = require('../dist/index.js');
  assert(isOnScale(0) === true, '0 should be on scale');
});

test('nearestScaleValue: 17 → 16', () => {
  const { nearestScaleValue } = require('../dist/index.js');
  assert(nearestScaleValue(17) === 16, `Expected 16, got ${nearestScaleValue(17)}`);
});

test('nearestScaleValue: 50 → 48', () => {
  const { nearestScaleValue } = require('../dist/index.js');
  assert(nearestScaleValue(50) === 48, `Expected 48, got ${nearestScaleValue(50)}`);
});

test('validateInternalExternal: valid', () => {
  const { validateInternalExternal } = require('../dist/index.js');
  assert(validateInternalExternal(16, 24).valid === true, '16 ≤ 24 should pass');
});

test('validateInternalExternal: invalid', () => {
  const { validateInternalExternal } = require('../dist/index.js');
  assert(validateInternalExternal(24, 16).valid === false, '24 > 16 should fail');
});

test('generateSpacingTokens: produces CSS', () => {
  const { generateSpacingTokens } = require('../dist/index.js');
  const css = generateSpacingTokens();
  assert(css.includes(':root'), 'Should have :root');
  assert(css.includes('--space-'), 'Should have spacing tokens');
});

test('validateSectionSpacing: 64px passes', () => {
  const { validateSectionSpacing } = require('../dist/index.js');
  assert(validateSectionSpacing(64).valid === true, '64px should pass');
});

test('validateSectionSpacing: 24px fails', () => {
  const { validateSectionSpacing } = require('../dist/index.js');
  assert(validateSectionSpacing(24).valid === false, '24px should fail (too small)');
});

test('SPACING_TOKENS: has expected values', () => {
  const { SPACING_TOKENS } = require('../dist/index.js');
  assert(SPACING_TOKENS['4'] === 16, 'Token 4 should be 16px');
  assert(SPACING_TOKENS['8'] === 32, 'Token 8 should be 32px');
  assert(SPACING_TOKENS['16'] === 64, 'Token 16 should be 64px');
});

// ─── Run all tests ───

let passed = 0;
let failed = 0;
const failures = [];

for (const { name, fn } of tests) {
  try {
    fn();
    passed++;
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message });
  }
}

console.log(`\n  frontcraft test suite\n`);
console.log(`  ${passed + failed} tests | ${passed} passed | ${failed} failed\n`);

if (failures.length > 0) {
  console.log('  Failures:');
  for (const f of failures) {
    console.log(`    ✗ ${f.name}: ${f.error}`);
  }
  console.log('');
  process.exit(1);
} else {
  console.log(`  All ${passed} tests passed.\n`);
}
