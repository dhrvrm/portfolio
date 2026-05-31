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
const OUT_DIR = join(ROOT, 'public', 'images', 'blog', 'wrong-problems');
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

const TOTAL = 9;

const POSTS = [
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

const pad2 = (n) => String(n).padStart(2, '0');

function html(post) {
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
.frame{position:absolute;inset:64px;display:flex;flex-direction:column;justify-content:space-between;z-index:2;}
.top{display:flex;justify-content:space-between;align-items:center;}
.kicker{font-family:'Mono';font-weight:500;font-size:18px;letter-spacing:0.42em;color:${ACCENT};text-transform:uppercase;}
.index{font-family:'Mono';font-weight:500;font-size:18px;letter-spacing:0.2em;color:${MUTED};}
.index b{color:${INK};}
.mid{margin-top:auto;margin-bottom:38px;}
.tick{width:64px;height:3px;background:${ACCENT};margin-bottom:30px;}
.line{font-family:'Grotesk';font-weight:600;font-size:104px;line-height:0.98;letter-spacing:-0.025em;color:${INK};}
.bottom{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid ${FAINT};padding-top:24px;}
.meta{font-family:'Mono';font-weight:500;font-size:18px;letter-spacing:0.06em;color:${MUTED};}
.brand{font-family:'Mono';font-weight:500;font-size:18px;letter-spacing:0.22em;color:${MUTED};text-transform:uppercase;}
</style></head><body>
<div class="cover">
  <div class="ghost">${pad2(post.part)}</div>
  <div class="frame">
    <div class="top">
      <div class="kicker">Wrong Problems</div>
      <div class="index"><b>${pad2(post.part)}</b> / ${pad2(TOTAL)}</div>
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

mkdirSync(OUT_DIR, { recursive: true });
const work = mkdtempSync(join(tmpdir(), 'covers-'));

for (const post of POSTS) {
  const htmlPath = join(work, `${post.file}.html`);
  const pngPath = join(work, `${post.file}.png`);
  const webpPath = join(OUT_DIR, `${post.file}.webp`);
  writeFileSync(htmlPath, html(post));

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

rmSync(work, { recursive: true, force: true });
console.log(`\nDone → ${OUT_DIR}`);
