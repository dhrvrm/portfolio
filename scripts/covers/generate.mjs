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
  { part: 10, file: '10-cities',      lines: ['OUR CITIES GIVE US', 'NOTHING TO DO', 'BUT SPEND'],              meta: 'india · systems · urban planning' },
];

const SERIES = [
  {
    kicker: 'Wrong Problems',
    outDir: join(ROOT, 'public', 'images', 'blog', 'wrong-problems'),
    total: 10,
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
    total: 5,
    standalone: true, // unrelated essays: hide the NN/NN index
    motifs: {
      '01-flowers': `
        <path d="M200 408 Q380 402 560 406"/>
        <path d="M330 406 Q331 376 330 346 M382 406 Q381 376 382 346 M322 348 Q356 343 390 347"/>
        <path d="M420 406 Q421 344 420 282 M472 406 Q471 344 472 282 M412 284 Q446 279 480 283"/>
        <path d="M502 406 Q500 260 503 108 Q548 102 588 107 Q591 260 589 406"/>
        <path d="M512 138 l66 -15 m-68 55 l70 -16 m-70 56 l70 -16 m-70 56 l70 -16 m-70 56 l70 -16"/>
        <path class="hot" d="M240 406 Q246 370 244 336"/>
        <path class="hot" d="M244 336 Q228 330 228 316 Q228 302 241 300 Q232 286 245 279 Q258 272 265 284 Q278 275 286 287 Q293 299 281 306 Q292 317 283 328 Q274 338 261 331 Q253 341 244 336"/>`,
      '02-griefs': `
        <path d="M240 408 Q400 402 560 406"/>
        <path stroke-dasharray="0.1 16" d="M446 150 a20 20 0 1 0 6 -4"/>
        <path stroke-dasharray="0.1 16" d="M462 196 Q432 202 426 268 Q420 344 440 350 Q478 355 484 346 Q494 268 480 200 Q476 194 462 196"/>
        <path stroke-dasharray="0.1 16" d="M440 350 Q438 376 440 400 M472 350 Q474 376 472 400"/>
        <path class="hot" d="M316 406 Q322 370 320 336"/>
        <path class="hot" d="M320 336 Q304 330 304 316 Q304 302 317 300 Q308 286 321 279 Q334 272 341 284 Q354 275 362 287 Q369 299 357 306 Q368 317 359 328 Q350 338 337 331 Q329 341 320 336"/>`,
      '03-argument': `
        <path d="M180 400 Q360 394 570 398"/>
        <path d="M330 396 Q345 362 358 330 Q373 364 386 396"/>
        <path d="M200 372 Q360 330 520 288"/>
        <path d="M196 372 Q193 350 194 330 Q220 327 246 330 Q249 350 248 370 Q222 375 196 372"/>
        <path class="hot" d="M520 288 Q521 268 520 250"/>
        <path class="hot" d="M520 252 Q538 251 550 257 Q537 264 521 263"/>`,
      '04-signals': `
        <path d="M60 220 L82 130 L100 300 L118 118 L138 318 L158 140 L180 286 L202 158 L222 272 L242 178 L258 240 L272 206"/>
        <path d="M300 110 Q298 220 300 330"/>
        <path class="hot" d="M330 220 Q344 202 358 220 Q372 238 386 220 Q400 202 414 220 Q428 238 442 220 Q456 202 470 220 Q484 238 498 220 Q512 202 526 220 Q540 238 554 220"/>`,
      '05-deathzone': `
        <path d="M40 408 Q160 320 236 234 Q292 168 336 116 Q388 172 438 232 Q510 318 590 408"/>
        <path stroke-dasharray="3 14" d="M60 200 Q330 192 588 200"/>
        <path class="hot" d="M336 114 Q337 92 336 74"/>
        <path class="hot" d="M336 76 Q354 75 366 81 Q353 88 337 87"/>`,
    },
    posts: [
      { part: 1, file: '01-flowers', lines: ['FLOWERS ARE NOT', 'THE BARE MINIMUM'], meta: 'appreciation · relationships · people' },
      { part: 2, file: '02-griefs', lines: ['THE GRIEFS THAT', "DON'T GET FUNERALS"], meta: 'grief · loss · people' },
      { part: 3, file: '03-argument', lines: ['YOU CAN WIN', 'THE ARGUMENT AND', 'LOSE THE ROOM'], meta: 'communication · ego · people' },
      { part: 4, file: '04-signals', lines: ['WHAT SMART', 'ACTUALLY', 'SOUNDS LIKE'], meta: 'intelligence · humility · people' },
      { part: 5, file: '05-deathzone', lines: ['YOU GIVE UP,', 'YOU DIE'], meta: 'mindset · grit · people' },
    ],
  },
  {
    kicker: 'Conversations with S',
    outDir: join(ROOT, 'public', 'images', 'blog', 'conversations-with-s'),
    total: 2,
    accent: '#f472b6',
    motifs: {
      '00-pour': `
        <path d="M120 120 Q170 95 220 110 Q236 150 222 190 Q176 206 136 184 Q112 150 120 120"/>
        <path d="M222 122 Q244 126 248 143 Q244 158 226 160"/>
        <path stroke-dasharray="1 16" d="M250 118 Q290 143 326 168"/>
        <path d="M420 330 Q418 372 430 404 Q466 414 500 404 Q512 372 510 330 Q465 322 420 330"/>
        <path class="hot" d="M368 232 Q365 204 373 182 Q381 166 392 177 Q397 185 394 204 M394 204 Q402 176 413 182 Q421 188 416 210 M416 210 Q427 188 436 196 Q443 205 435 227 Q427 257 405 268 Q378 276 367 254 Q362 243 368 232"/>
        <path class="hot" d="M367 254 Q351 265 346 281"/>`,
      '01-dishes': `
        <path d="M370 330 Q460 316 550 330 Q460 346 370 330"/>
        <path d="M380 296 Q460 284 540 296 Q460 310 380 296"/>
        <path d="M390 262 Q460 252 530 262 Q460 274 390 262"/>
        <path d="M370 330 Q368 356 372 380 M550 330 Q552 356 548 380 M372 380 Q460 392 548 380" stroke-dasharray="2 14"/>
        <path class="hot" d="M460 214 Q432 186 440 164 Q448 146 464 158 Q472 164 462 178 M462 178 Q470 158 486 164 Q500 172 490 190 Q480 204 460 214"/>`,
    },
    posts: [
      { part: 0, file: '00-pour', lines: ['THE FRIEND WHO', 'STOPS ME', 'MID-POUR'], meta: 'friendship · boundaries · people' },
      { part: 1, file: '01-dishes', lines: ['I WANT YOU', 'TO WANT TO DO', 'THE DISHES'], meta: 'friendship · care · people' },
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
      ${total > 1 && !series.standalone ? `<div class="index"><b>${pad2(post.part)}</b> / ${pad2(total)}</div>` : ''}
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
