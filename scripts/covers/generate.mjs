// Reusable cover generator for the "wrong problems" blog series.
// Renders an editorial dark cover per post via headless Chrome, then encodes webp with sharp.
// Run: node scripts/covers/generate.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const F = (p) => 'file://' + join(ROOT, 'node_modules', p);
const FONT_GROTESK = F('@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2');
const FONT_INTER = F('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
const FONT_MONO = F('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2');

// Design tokens (dark theme, from src/styles/tokens.css)
const BG = '#090909';
const SURFACE = '#121212';
const INK = '#fafafa';
const MUTED = '#a3a3a3';
const FAINT = '#171717';
const ACCENT = '#fbbf24';

const POSTS_WRONG_PROBLEMS = [
  { part: 1, file: '01-roads',        lines: ['WE KEEP SOLVING', 'THE WRONG PROBLEM', 'ON INDIAN ROADS'],     meta: 'india · systems · public policy' },
  { part: 2, file: '02-bikers',       lines: ['IN INDIA,', 'THE BIKER IS TREATED', 'LIKE THE PROBLEM'],        meta: 'india · systems · public policy' },
  { part: 3, file: '03-tax',          lines: ['WE BUILT A TAX SYSTEM', 'THAT ONLY CATCHES', 'THE HONEST'],      meta: 'india · systems · economy' },
  { part: 4, file: '04-women-safety', lines: ['WE KEEP TELLING', 'WOMEN', 'TO BE CAREFUL'],                     meta: 'india · systems · workplace' },
  { part: 5, file: '05-pollution',    lines: ['WE LET PEOPLE BUY', 'THEIR OWN CLEAN', 'AIR AND WATER'],         meta: 'india · systems · environment' },
  { part: 6, file: '06-education',    lines: ['WE NEVER LEARNED', 'TO THINK,', 'OR TO BE SEEN'],                meta: 'india · systems · education' },
  { part: 7, file: '07-healthcare',   lines: ['IN INDIA, CARE', 'DEPENDS ON', 'WHO YOU KNOW'],                  meta: 'india · systems · healthcare' },
  { part: 8, file: '08-policing',     lines: ["YOU CAN'T GET JUSTICE,", "AND YOU CAN'T", 'TAKE IT YOURSELF'],   meta: 'india · systems · justice' },
  { part: 9, file: '09-speaking-up',  lines: ['THE HARD', 'CONVERSATION', 'WE KEEP AVOIDING'],                  meta: 'systems · communication · growth' },
];

const SERIES = [
  {
    kicker: 'Wrong Problems',
    outDir: join(ROOT, 'public', 'images', 'blog', 'wrong-problems'),
    total: 9,
    posts: POSTS_WRONG_PROBLEMS,
  },
  {
    kicker: 'Finding Your People',
    outDir: join(ROOT, 'public', 'images', 'blog', 'finding-your-people'),
    total: 5,
    accent: '#2dd4bf',
    // per-post hand-drawn motif (same language as the in-post doodles), replaces the ghost numeral
    motifs: {
      '01-runway': `
        <path d="M120 110 Q260 102 390 108 T530 106"/>
        <path d="M530 112 Q536 220 528 330"/>
        <path d="M516 316 L529 334 L542 317"/>
        <path class="hot" d="M530 356 Q531 344 530 336 M530 336 Q550 335 562 342 Q549 349 531 348"/>`,
      '02-escalation': `
        <path d="M250 342 Q400 336 560 338"/>
        <path class="hot" d="M262 342 L306 340 L310 292 L358 290 L362 240 L410 238 L414 188 L462 186 L466 134 L514 132 L518 82"/>`,
      '03-well': `
        <path d="M400 372 Q396 262 402 168"/>
        <path d="M572 372 Q576 266 570 170"/>
        <path d="M386 168 Q486 156 586 168"/>
        <path class="hot" d="M420 226 Q460 217 502 226 T552 222"/>`,
      '04-door': `
        <path d="M350 382 L352 100 Q352 86 366 86 L488 86 Q502 86 502 100 L504 382"/>
        <path d="M352 96 Q410 72 454 62 M454 62 Q460 214 456 352 M456 352 Q410 368 352 378"/>
        <path class="hot" d="M476 108 Q482 240 476 368"/>
        <path class="hot" d="M492 160 l26 -14 M494 240 l28 0 M492 316 l26 14"/>`,
      '05-dialect': `
        <path d="M222 142 a82 72 0 1 0 12 -5"/>
        <path d="M258 152 Q255 200 260 246 M300 150 Q297 198 302 244 M257 180 h44 M258 212 h44"/>
        <path d="M428 142 a82 72 0 1 0 12 -5"/>
        <path d="M498 196 c20 -4 24 20 6 26 c-24 8 -35 -20 -11 -35 c32 -20 55 16 27 40 c-20 18 -51 8 -55 -16"/>
        <path class="hot" d="M374 188 Q392 185 412 188 M375 216 Q393 213 413 216"/>`,
    },
    posts: [
      { part: 1, file: '01-runway',     lines: ['SMALL TALK', 'IS THE RUNWAY'],                          meta: 'connection · conversation · people' },
      { part: 2, file: '02-escalation', lines: ["INTIMACY ISN'T", 'BUILT FROM TIME'],                    meta: 'connection · conversation · people' },
      { part: 3, file: '03-well',       lines: ["YOU CAN'T INTERROGATE", 'SOMEONE INTO', 'VULNERABILITY'], meta: 'connection · listening · people' },
      { part: 4, file: '04-door',       lines: ['THE DOOR', 'LEFT AJAR'],                                meta: 'connection · listening · people' },
      { part: 5, file: '05-dialect',    lines: ['THE DIALECT', 'OF DEPTH'],                              meta: 'connection · community · people' },
    ],
  },
  {
    kicker: 'Notes',
    outDir: join(ROOT, 'public', 'images', 'blog', 'notes'),
    total: 1,
    motifs: {
      '01-flowers': `
        <path d="M200 408 Q380 402 560 406"/>
        <path d="M330 406 Q331 376 330 346 M382 406 Q381 376 382 346 M322 348 Q356 343 390 347"/>
        <path d="M420 406 Q421 344 420 282 M472 406 Q471 344 472 282 M412 284 Q446 279 480 283"/>
        <path d="M502 406 Q500 260 503 108 Q548 102 588 107 Q591 260 589 406"/>
        <path d="M512 138 l66 -15 m-68 55 l70 -16 m-70 56 l70 -16 m-70 56 l70 -16 m-70 56 l70 -16"/>
        <path class="hot" d="M240 406 Q246 370 244 336"/>
        <path class="hot" d="M244 336 Q228 330 228 316 Q228 302 241 300 Q232 286 245 279 Q258 272 265 284 Q278 275 286 287 Q293 299 281 306 Q292 317 283 328 Q274 338 261 331 Q253 341 244 336"/>`,
    },
    posts: [
      { part: 1, file: '01-flowers', lines: ['FLOWERS ARE NOT', 'THE BARE MINIMUM'], meta: 'appreciation · relationships · people' },
    ],
  },
];


const pad2 = (n) => String(n).padStart(2, '0');

function html(post, series) {
  const kicker = series.kicker;
  const total = series.total;
  const accent = series.accent || ACCENT;
  const motif = series.motifs?.[post.file];
  const secondRead = motif
    ? `<svg class="motif" viewBox="0 0 600 440">${motif}</svg>`
    : `<div class="ghost">${pad2(post.part)}</div>`;
  const headline = post.lines.map((l) => `<div class="line">${l}</div>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Grotesk';src:url('${FONT_GROTESK}') format('woff2');font-weight:300 700;}
@font-face{font-family:'Inter';src:url('${FONT_INTER}') format('woff2');font-weight:300 700;}
@font-face{font-family:'Mono';src:url('${FONT_MONO}') format('woff2');font-weight:500;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1600px;height:900px;}
.cover{position:relative;width:1600px;height:900px;background:${BG};overflow:hidden;
  /* subtle technical grid + corner vignette */
  background-image:
    radial-gradient(120% 90% at 88% 12%, ${SURFACE} 0%, ${BG} 55%),
    linear-gradient(${FAINT} 1px, transparent 1px),
    linear-gradient(90deg, ${FAINT} 1px, transparent 1px);
  background-size:100% 100%, 64px 64px, 64px 64px;
  font-family:'Inter',sans-serif;color:${INK};}
/* oversized faint part numeral — the single second-read motif */
.ghost{position:absolute;right:-60px;bottom:-220px;font-family:'Grotesk';font-weight:700;
  font-size:760px;line-height:1;color:${FAINT};letter-spacing:-0.04em;user-select:none;}
.motif{position:absolute;right:44px;bottom:52px;width:740px;height:543px;fill:none;
  stroke:${accent};stroke-opacity:.34;stroke-width:6.5;stroke-linecap:round;stroke-linejoin:round;}
.motif .hot{stroke:${accent};stroke-opacity:.85;}
.frame{position:absolute;inset:64px;display:flex;flex-direction:column;justify-content:space-between;z-index:2;}
.top{display:flex;justify-content:space-between;align-items:center;}
.kicker{font-family:'Mono';font-weight:500;font-size:18px;letter-spacing:0.42em;color:${accent};text-transform:uppercase;}
.index{font-family:'Mono';font-weight:500;font-size:18px;letter-spacing:0.2em;color:${MUTED};}
.index b{color:${INK};}
.mid{margin-top:auto;margin-bottom:38px;}
.tick{width:64px;height:3px;background:${accent};margin-bottom:30px;}
.line{font-family:'Grotesk';font-weight:600;font-size:104px;line-height:0.98;letter-spacing:-0.025em;color:${INK};}
.bottom{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid ${FAINT};padding-top:24px;}
.meta{font-family:'Mono';font-weight:500;font-size:18px;letter-spacing:0.06em;color:${MUTED};}
.brand{font-family:'Mono';font-weight:500;font-size:18px;letter-spacing:0.22em;color:${MUTED};text-transform:uppercase;}
</style></head><body>
<div class="cover">
  ${secondRead}
  <div class="frame">
    <div class="top">
      <div class="kicker">${kicker}</div>
      ${total > 1 ? `<div class="index"><b>${pad2(post.part)}</b> / ${pad2(total)}</div>` : ''}
    </div>
    <div class="mid">
      <div class="tick"></div>
      ${headline}
    </div>
    <div class="bottom">
      <div class="meta">${post.meta}</div>
      <div class="brand">dhrvrm · essays</div>
    </div>
  </div>
</div>
</body></html>`;
}

const work = mkdtempSync(join(tmpdir(), 'covers-'));

for (const series of SERIES) {
mkdirSync(series.outDir, { recursive: true });
for (const post of series.posts) {
  const htmlPath = join(work, `${post.file}.html`);
  const pngPath = join(work, `${post.file}.png`);
  const webpPath = join(series.outDir, `${post.file}.webp`);
  writeFileSync(htmlPath, html(post, series));

  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--force-device-scale-factor=2',
    '--window-size=1600,900',
    `--screenshot=${pngPath}`,
    'file://' + htmlPath,
  ], { stdio: 'ignore' });

  await sharp(readFileSync(pngPath))
    .resize(1600, 900, { fit: 'cover' })
    .webp({ quality: 82 })
    .toFile(webpPath);

  console.log(`✓ ${post.file}.webp`);
}
}

rmSync(work, { recursive: true, force: true });
console.log('\nDone.');
