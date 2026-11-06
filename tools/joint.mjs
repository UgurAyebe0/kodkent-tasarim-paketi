import { validate } from 'file:///C:/Users/uuray/AppData/Local/Temp/claude/bundled-skills/2.1.309/e03b2db61a11333bf0feb5da9ef380b6/dataviz/scripts/validate_palette.js';
const CANDS = {
  light: { kobalt:["#2448B5","#2B55D1"], mercan:["#E8553E","#D9472F"], turkuaz:["#00979F","#0892A8"], amber:["#C98500","#B87A00"], mor:["#6D4AFF","#6250D6"], nane:["#1E9E5F","#1A8F55"] },
  dark:  { kobalt:["#3F6FE0","#4A7BF0"], mercan:["#E8553E","#F06A52"], turkuaz:["#16A9AE","#19B0B5"], amber:["#C98500","#D18F0A"], mor:["#8A6CFF","#7C5CFF"], nane:["#2BB673","#24A868"] },
};
const SURF = { light: '#FFFFFF', dark: '#151D36' };
const num = s => { const m = /ΔE\s+([\d.]+)/.exec(s || ''); return m ? +m[1] : 0; };
function score(pal, mode) { const r = validate(pal, { mode, surface: SURF[mode] }); const [band, chroma, cvd, normal, contrast] = r.report; return { pass: band[1] === true && chroma[1] === true && contrast[1] !== 'relief' && contrast[1] !== false && num(normal[2]) >= 15 && num(cvd[2]) >= 8, cvd: num(cvd[2]), normal: num(normal[2]) }; }
function* perms(a) { if (a.length <= 1) { yield a; return; } for (let i = 0; i < a.length; i++) { const rest = [...a.slice(0, i), ...a.slice(i + 1)]; for (const p of perms(rest)) yield [a[i], ...p]; } }
function* product(lists) { if (!lists.length) { yield []; return; } for (const x of lists[0]) for (const rest of product(lists.slice(1))) yield [x, ...rest]; }
const HUES = ['kobalt','mercan','turkuaz','amber','mor','nane'];
let best = null;
for (const order of perms([0,1,2,3,4,5])) {
  const names = order.map(i => HUES[i]);
  const per = {};
  for (const mode of ['light','dark']) {
    let b = null;
    for (const combo of product(names.map(h => CANDS[mode][h]))) { const s = score(combo, mode); if (!s.pass) continue; if (!b || s.cvd > b.cvd) b = { pal: combo, ...s }; }
    per[mode] = b;
  }
  if (!per.light || !per.dark) continue;
  const joint = Math.min(per.light.cvd, per.dark.cvd);
  const jn = Math.min(per.light.normal, per.dark.normal);
  const key = joint * 1000 + jn + (names[0] === 'turkuaz' ? 0.5 : 0);
  if (!best || key > best.key) best = { key, names, joint, jn, light: per.light, dark: per.dark };
}
console.log(JSON.stringify(best, null, 1));
