import { createHash } from "node:crypto"
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { Resvg } from "@resvg/resvg-js"
import {
  assertContent,
  formatHot,
  kindLabel,
  quizHref,
  quizzes,
  resultBounds,
  resultHref,
  resultsOf,
  site,
  tagLabel,
  tags,
} from "../src/content.js"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const fontFile = join(root, "scripts/fonts/GmarketSansBold.otf")
const tilts = [-0.8, 0.7, -0.4, 1, -1.1, 0.5, -0.6, 0.9]

assertContent()

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function xml(value) {
  // Gmarket Sans has no ASCII space glyph. Word gaps are em offsets, not a missing glyph.
  return String(value)
    .split(" ")
    .map((part, index) => {
      const dx = index === 0 ? "" : ` dx="0.28em"`
      return `<tspan${dx}>${esc(part)}</tspan>`
    })
    .join("")
}

function chars(value) {
  return [...String(value)]
}

function wrapTitle(title, max = 10) {
  if (chars(title).length <= max + 1) return [title]
  if (!title.includes(" ")) {
    const all = chars(title)
    const mid = Math.ceil(all.length / 2)
    return [all.slice(0, mid).join(""), all.slice(mid).join("")]
  }
  const lines = []
  let current = ""
  for (const word of title.split(" ")) {
    const next = current ? `${current} ${word}` : word
    if (chars(next).length > max && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)
}

function wrapByWidth(text, max) {
  const lines = []
  let current = ""
  for (const word of String(text).split(" ")) {
    const next = current ? `${current} ${word}` : word
    if (chars(next).length > max && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

function hash(value) {
  return createHash("sha1").update(value).digest("hex").slice(0, 8)
}

function emptyDir(dir) {
  mkdirSync(dir, { recursive: true })
  for (const name of readdirSync(dir)) rmSync(join(dir, name), { recursive: true, force: true })
}

function write(file, contents) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, contents)
}

function out(href) {
  return join(root, href.replace(/^\//, ""))
}

function renderPng(svg, file) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
    font: {
      fontFiles: [fontFile],
      loadSystemFonts: false,
      defaultFontFamily: "Gmarket Sans",
    },
  })
  const png = resvg.render().asPng()
  write(file, png)
  if (png.length < 5000) throw new Error(`poster too small: ${file}`)
}

function textLine(line, y, size) {
  return `<text x="600" y="${y}" text-anchor="middle" font-family="Gmarket Sans" font-size="${size}" font-weight="700" fill="#141414">${xml(line)}</text>`
}

function poster({ kicker, corner, lines, size, firstY, meter, blurbLines, blurbY }) {
  const headlines = lines
    .map((line, index) => textLine(line, firstY + index * (size + 8), size))
    .join("")
  const blurbs = (blurbLines ?? [])
    .map((line, index) => {
      return `<text x="600" y="${blurbY + index * 40}" text-anchor="middle" font-family="Gmarket Sans" font-size="30" font-weight="700" fill="#141414">${xml(line)}</text>`
    })
    .join("")
  const meterMarkup = meter
    ? (() => {
        const width = Math.min(920, Math.max(320, chars(meter).length * 38 + 96))
        const x = (1200 - width) / 2
        const y = firstY + (lines.length - 1) * (size + 8) + 34
        return `<rect x="${x}" y="${y}" width="${width}" height="74" fill="#ffe600" stroke="#141414" stroke-width="8"/>
        <text x="600" y="${y + 49}" text-anchor="middle" font-family="Gmarket Sans" font-size="34" font-weight="700" fill="#141414">${xml(meter)}</text>`
      })()
    : ""
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#ffe600"/>
  <rect x="28" y="28" width="1144" height="574" fill="#fffdf8" stroke="#141414" stroke-width="14"/>
  <rect x="70" y="72" width="196" height="58" fill="#ff007f" stroke="#141414" stroke-width="6" transform="rotate(-3 168 101)"/>
  <text x="168" y="110" text-anchor="middle" font-family="Gmarket Sans" font-size="28" font-weight="700" fill="#141414">${xml(kicker)}</text>
  <text x="1090" y="112" text-anchor="end" font-family="Gmarket Sans" font-size="28" font-weight="700" fill="#141414">${xml(corner)}</text>
  ${headlines}
  ${meterMarkup}
  ${blurbs}
  <rect x="28" y="524" width="1144" height="78" fill="#141414"/>
  <text x="600" y="574" text-anchor="middle" font-family="Gmarket Sans" font-size="32" font-weight="700" fill="#ffe600">${xml(site.domain)}</text>
</svg>`
}

function relatedTo(quiz) {
  return quizzes
    .filter((other) => other.id !== quiz.id)
    .map((other) => ({
      other,
      score: other.tags.filter((tag) => quiz.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.other.hot - a.other.hot)
    .slice(0, 3)
    .map((row) => row.other)
}

function card(quiz, { feature = false, stamps = [] } = {}) {
  const tilt = tilts[quizzes.findIndex((item) => item.id === quiz.id) % tilts.length]
  const stampHtml = stamps
    .map((stamp) => `<span class="mini-stamp${stamp === "최신" ? " mini-stamp--new" : ""}">${stamp}</span>`)
    .join("")
  const tagHtml = quiz.tags.map((id) => `<span>#${esc(tagLabel(id))}</span>`).join("")
  return `<a class="card${feature ? " card--feature" : ""}" href="${quizHref(quiz)}" data-hot="${quiz.hot}" data-date="${quiz.published}" data-tags="${quiz.tags.join(",")}" style="--tilt:${tilt}deg">
    <div class="card__stamps">${stampHtml}</div>
    <p class="card__emoji">${quiz.emoji}</p>
    <p class="card__kind">${esc(kindLabel(quiz))}</p>
    <h3>${esc(quiz.title)}</h3>
    <p class="card__blurb">${esc(quiz.blurb)}</p>
    <p class="card__tags">${tagHtml}</p>
    <p class="card__meta"><span>${esc(formatHot(quiz.hot))} 참여</span><span>시작하기</span></p>
  </a>`
}

function header() {
  return `<header class="topbar">
    <a class="chip chip--home" href="/">🏠 <span>홈</span></a>
    <a class="brand" href="/">타로</a>
    <button type="button" class="chip chip--browse" data-open-browse>🔍 다른 테스트 구경하기</button>
  </header>`
}

function footer() {
  return `<footer class="site-footer">
    <p>타로 · ${esc(site.domain)}</p>
    <p>재미로 보는 테스트다. 결과는 내일 아침이면 효력 없음.</p>
    <nav class="site-footer__links" aria-label="안내">
      <a href="/about.html">어바웃</a>
      <a href="/privacy.html">개인정보 처리방침</a>
      <a href="/terms.html">이용약관</a>
    </nav>
    <p>글꼴 Gmarket Sans · Gmarket</p>
  </footer>`
}

function sheet(currentId) {
  const items = [...quizzes].sort((a, b) => b.hot - a.hot)
  const list = items
    .map((quiz) => {
      const current = quiz.id === currentId ? ` aria-current="page"` : ""
      const here = quiz.id === currentId ? " · 지금 여기" : ""
      const label = quiz.tags.map((id) => `#${esc(tagLabel(id))}`).join(" ")
      return `<li><a href="${quizHref(quiz)}"${current}><span class="sheet__emoji">${quiz.emoji}</span><span class="sheet__title">${esc(quiz.title)}${here}</span><span>${esc(kindLabel(quiz))} · ${label}</span></a></li>`
    })
    .join("")
  return `<div class="sheet" data-browse hidden>
    <div class="sheet__backdrop" data-close-browse></div>
    <div class="sheet__panel" role="dialog" aria-modal="true" aria-labelledby="browse-title">
      <div class="sheet__head">
        <h2 id="browse-title">다른 테스트 구경하기</h2>
        <button type="button" class="chip" data-close-browse>닫기</button>
      </div>
      <ul class="sheet__list">${list}</ul>
    </div>
  </div>`
}

function shell({ title, description, path, image, script, json, main, banner = "", currentId = "", robots = "" }) {
  const canonical = `${site.url}${path}`
  const imageUrl = `${site.url}${image}`
  const robotMeta = robots ? `<meta name="robots" content="${esc(robots)}" />` : ""
  const data = json ? `<script type="application/json" id="${json.id}">${json.body}</script>` : ""
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="theme-color" content="#ffe600" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  ${robotMeta}
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:site_name" content="${esc(site.name)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="preload" href="/fonts/GmarketSansBold.woff" as="font" type="font/woff" crossorigin />
  <style>body{margin:0;background:#ffe566;color:#141414}</style>
</head>
<body>
  <a class="skip" href="#content">본문으로</a>
  ${header()}
  ${banner}
  <main id="content" class="wrap">
    ${main}
  </main>
  ${footer()}
  ${sheet(currentId)}
  <div class="toast" data-toast role="status"></div>
  ${data}
  <script type="module" src="${script}"></script>
</body>
</html>
`
}

function saveImage(svg, name) {
  const file = `/og/${name}.png`
  renderPng(svg, join(root, "public", file))
  return file
}

emptyDir(join(root, "public/og"))
emptyDir(join(root, "quiz"))
emptyDir(join(root, "result"))

const homeSvg = poster({
  kicker: "입장",
  corner: "B급 인증",
  lines: [site.name],
  size: 140,
  firstY: 280,
  blurbLines: wrapByWidth(site.tagline, 18),
  blurbY: 360,
})
const homeImage = saveImage(homeSvg, "home")

const pages = ["/", "/404.html"]

for (const quiz of quizzes) {
  const quizLines = wrapTitle(quiz.title, 11)
  const quizSize = quizLines.length > 1 ? 58 : 72
  const quizImage = saveImage(
    poster({
      kicker: quiz.kind === "worldcup" ? "월드컵" : "퀴즈",
      corner: kindLabel(quiz),
      lines: quizLines,
      size: quizSize,
      firstY: quizLines.length > 1 ? 250 : 280,
      blurbLines: wrapByWidth(quiz.blurb, 24).slice(0, 2),
      blurbY: quizLines.length > 1 ? 400 : 360,
    }),
    `quiz-${quiz.id}-${hash(quiz.title + quiz.blurb)}`,
  )
  pages.push(quizHref(quiz))

  const tagHtml = quiz.tags.map((id) => `<span>#${esc(tagLabel(id))}</span>`).join("")
  const play = `<article class="play">
    <p class="kicker tag-row">${tagHtml}<span>${esc(kindLabel(quiz))}</span></p>
    <h1>${esc(quiz.title)}</h1>
    <p class="lede">${esc(quiz.blurb)}</p>
    <div id="stage" class="stage" aria-live="polite">
      <p>질문을 준비하고 있어요.</p>
    </div>
    <p class="fineprint"><button type="button" class="text-button" id="restart">처음부터 다시</button></p>
  </article>`

  if (quiz.kind === "quiz") {
    const payload = {
      id: quiz.id,
      questions: quiz.questions,
      results: quiz.results.map((result) => ({ id: result.id, ...resultBounds(result) })),
    }
    write(
      out(quizHref(quiz)),
      shell({
        title: `${quiz.title} | 타로`,
        description: quiz.blurb,
        path: quizHref(quiz),
        image: quizImage,
        script: "/src/quiz.js",
        currentId: quiz.id,
        json: { id: "quiz-data", body: JSON.stringify(payload).replaceAll("<", "\\u003c") },
        main: play,
      }),
    )
  } else {
    const payload = {
      id: quiz.id,
      fighters: quiz.fighters.map(({ id, emoji, name, tease }) => ({ id, emoji, name, tease })),
    }
    write(
      out(quizHref(quiz)),
      shell({
        title: `${quiz.title} | 타로`,
        description: quiz.blurb,
        path: quizHref(quiz),
        image: quizImage,
        script: "/src/worldcup.js",
        currentId: quiz.id,
        json: { id: "cup-data", body: JSON.stringify(payload).replaceAll("<", "\\u003c") },
        main: play,
      }),
    )
  }

  for (const result of resultsOf(quiz)) {
    const lines = wrapTitle(result.title, 10)
    const size = lines.length > 1 ? 58 : 76
    const image = saveImage(
      poster({
        kicker: "결과",
        corner: quiz.title,
        lines,
        size,
        firstY: lines.length > 1 ? 236 : 286,
        meter: result.meter,
      }),
      `${quiz.id}-${result.id}-${hash(result.title + result.meter + result.comment)}`,
    )
    const href = resultHref(quiz, result)
    pages.push(href)
    const shareTitle = `${result.title} — ${quiz.title}`
    const shareText = `[타로] ${quiz.title}\n내 결과는 「${result.title}」.\n너도 해봐.`
    const actions = `<div class="actions">
      <button type="button" class="b-class-button" data-share="kakao" data-path="${href}" data-title="${esc(shareTitle)}" data-text="${esc(shareText)}" data-image="${image}">🔗 카카오톡으로 공유</button>
      <button type="button" class="b-class-button" data-share="link" data-path="${href}" data-title="${esc(shareTitle)}" data-text="${esc(shareText)}" data-image="${image}">🔗 링크 공유하기</button>
      <a class="b-class-button" href="${quizHref(quiz)}">🔄 다시 하기</a>
    </div>`
    const more = `<section class="more">
      <h2>⚡ 다른 재미있는 테스트 더보기</h2>
      <div class="more__grid">${relatedTo(quiz).map((item) => card(item)).join("")}</div>
    </section>`
    const main = `<article class="result-layout">
      <article class="result-card">
        <img src="${image}" alt="" width="1200" height="630" />
        <div class="result-card__body">
          <p class="stamp stamp--result">🎯 최종 결과</p>
          <p class="kicker"><a href="${quizHref(quiz)}">${esc(quiz.title)}</a></p>
          <h1>${esc(result.title)}</h1>
          <p class="meter">${esc(result.meter)}</p>
          <p class="summary">${esc(result.summary)}</p>
          <div class="comment">
            <p class="comment__label">한 줄 코멘트</p>
            <p>${esc(result.comment)}</p>
          </div>
        </div>
      </article>
      ${actions}
      ${more}
    </article>`
    write(
      out(href),
      shell({
        title: `${shareTitle} | 타로`,
        description: result.comment,
        path: href,
        image,
        script: "/src/page.js",
        currentId: quiz.id,
        main,
      }),
    )
  }
}

const byHot = [...quizzes].sort((a, b) => b.hot - a.hot)
const newestId = [...quizzes].sort((a, b) => b.published.localeCompare(a.published))[0].id
const popularIds = new Set(byHot.slice(0, 2).map((quiz) => quiz.id))
const gallery = byHot
  .map((quiz) => {
    const stamps = []
    if (popularIds.has(quiz.id)) stamps.push("인기")
    if (quiz.id === newestId) stamps.push("최신")
    return card(quiz, { feature: quiz.id === byHot[0].id, stamps })
  })
  .join("")
const tagButtons = [
  `<button type="button" class="tag-button" data-tag="all" aria-pressed="true">전체</button>`,
  ...tags.map(
    (tag) => `<button type="button" class="tag-button" data-tag="${tag.id}" aria-pressed="false">#${esc(tag.label)}</button>`,
  ),
].join("")
const ticker = "※ 과학 아님 ※ 퀴즈는 3~5문제 ※ 결과는 내일 아침 무효 ※ 친구 단톡에 던질 것 ※ 편의점 야식은 진지하게 ※ 퇴사각은 재미로만 ※ "
const home = shell({
  title: "타로 — 심심하면 뇌 끄는 테스트장",
  description: "병맛 전투력, 카톡 답장 속도, 점심 결정장애, 편의점 야식 월드컵. 퀴즈는 3~5문제, 결과는 친구에게 공유해 보세요.",
  path: "/",
  image: homeImage,
  script: "/src/home.js",
  banner: `<div class="marquee" aria-hidden="true"><div class="marquee__track"><span>${ticker}</span><span>${ticker}</span></div></div>`,
  main: `<section class="hero">
    <div class="hero__card">
      <p class="stamp stamp--blue">과학 아님</p>
      <p class="stamp stamp--pink">B급 인증</p>
      <p class="hero__domain">${esc(site.domain)}</p>
      <h1>타로</h1>
      <p class="hero__tagline">${esc(site.tagline)}</p>
      <p class="hero__desc">퀴즈는 3~5문제, 월드컵은 8강. 심심할 때 가볍게 골라 보세요.</p>
    </div>
  </section>
  <section>
    <div class="section-head">
      <h2>테스트 진열장</h2>
      <p>많이 하는 것부터 모아 뒀어요. 태그로 골라 보거나, 새로 나온 것부터 봐도 좋아요.</p>
    </div>
    <div class="controls">
      <div class="sorts" role="tablist" aria-label="정렬">
        <button type="button" class="sort-button" role="tab" data-sort="hot" aria-selected="true">인기</button>
        <button type="button" class="sort-button" role="tab" data-sort="new" aria-selected="false">최신</button>
      </div>
      <div class="tags">${tagButtons}</div>
    </div>
    <div class="grid" id="gallery">${gallery}</div>
    <p id="empty" class="empty" hidden>이 태그에는 아직 테스트가 없어요. 전체를 다시 눌러 주세요.</p>
  </section>`,
})
write(join(root, "index.html"), home)

write(
  join(root, "404.html"),
  shell({
    title: "증발한 주소 | 타로",
    description: "이 주소는 없다. 테스트는 홈에 있다.",
    path: "/404.html",
    image: homeImage,
    script: "/src/page.js",
    robots: "noindex",
    main: `<section class="miss">
      <p class="stamp stamp--result">실종</p>
      <h1>이 주소는 장난치다 증발했다.</h1>
      <p>테스트는 홈 진열장에 있다. 퀴즈는 3~5문제면 끝난다.</p>
      <div class="actions"><a class="b-class-button" href="/">🏠 홈으로</a></div>
    </section>`,
  }),
)

const infoPages = [
  {
    path: "/about.html",
    title: "어바웃 | 타로",
    description: "타로는 마이멜로(MyMallow)가 운영하는 심심풀이 퀴즈 사이트입니다.",
    main: `<section class="miss doc">
      <p class="stamp stamp--result">안내</p>
      <h1>어바웃</h1>
      <p>타로는 마이멜로(MyMallow)가 운영하는 심심풀이 사이트입니다. 짧은 퀴즈와 월드컵으로 장난스러운 결과를 보여 주고, 그 결과를 카카오톡으로 나눠 볼 수 있습니다.</p>
      <p>결과는 오락을 위한 것입니다. 성격, 진로, 건강, 인간관계를 판단하거나 예측하지 않습니다.</p>
      <h2>운영</h2>
      <p>마이멜로 (MyMallow)</p>
      <p>문의 연락처는 이 사이트에 따로 공개되어 있지 않습니다.</p>
    </section>`,
  },
  {
    path: "/privacy.html",
    title: "개인정보 처리방침 | 타로",
    description: "타로는 회원가입 없이 이용하는 오락 사이트입니다. 답변은 브라우저 안에서만 계산됩니다.",
    main: `<section class="miss doc">
      <p class="stamp stamp--result">안내</p>
      <h1>개인정보 처리방침</h1>
      <p>타로는 마이멜로(MyMallow)가 운영하는 오락용 웹사이트입니다. 회원가입 없이 이용합니다. 아래는 사이트가 실제로 하는 일만 짧게 적었습니다. 2026년 11월 12일에 정리했습니다.</p>
      <h2>수집과 저장</h2>
      <p>퀴즈 답과 월드컵 선택은 결과 화면을 만들기 위해, 이용 중인 브라우저 안에서만 계산됩니다. 답변을 서버에 저장하지 않고, 계정도 만들지 않습니다.</p>
      <h2>카카오톡 공유</h2>
      <p>결과 화면에서 공유를 누르면 결과 제목, 짧은 문구, 이미지 주소, 페이지 주소가 기기의 공유 기능으로 넘어가거나 링크가 복사됩니다. 카카오톡 공유가 연결되어 있으면 같은 내용이 카카오톡 공유로 전달될 수 있습니다. 타로가 그 내용을 따로 보관하지는 않습니다.</p>
      <h2>분석과 광고</h2>
      <p>방문 통계를 위한 분석 도구나 광고는 넣어 두지 않았습니다.</p>
      <h2>운영</h2>
      <p>마이멜로 (MyMallow). 문의 연락처는 이 사이트에 따로 공개되어 있지 않습니다.</p>
    </section>`,
  },
  {
    path: "/terms.html",
    title: "이용약관 | 타로",
    description: "타로는 마이멜로(MyMallow)의 무료 오락 사이트입니다. 결과는 재미를 위한 것입니다.",
    main: `<section class="miss doc">
      <p class="stamp stamp--result">안내</p>
      <h1>이용약관</h1>
      <p>타로는 마이멜로(MyMallow)가 운영하는 무료 오락 사이트입니다. 퀴즈와 월드컵 결과는 재미를 위한 것이며, 사실의 판단이나 전문적인 조언이 아닙니다. 2026년 11월 12일에 정리했습니다.</p>
      <h2>이용</h2>
      <p>따로 가입하지 않고 볼 수 있습니다. 결과 링크를 친구에게 공유하는 것도 이용에 포함됩니다.</p>
      <h2>결과</h2>
      <p>결과는 언제든지 바뀌거나 내려갈 수 있습니다. 이 페이지는 법적 효력을 단정하는 계약서가 아니라, 사이트가 어떤 곳인지 알리는 안내입니다.</p>
      <h2>운영</h2>
      <p>마이멜로 (MyMallow). 문의 연락처는 이 사이트에 따로 공개되어 있지 않습니다.</p>
    </section>`,
  },
]

for (const info of infoPages) {
  pages.push(info.path)
  write(
    out(info.path),
    shell({
      title: info.title,
      description: info.description,
      path: info.path,
      image: homeImage,
      script: "/src/page.js",
      main: info.main,
    }),
  )
}

const urls = pages
  .map((path) => `  <url><loc>${site.url}${path === "/" ? "/" : path}</loc></url>`)
  .join("\n")
write(
  join(root, "public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
write(
  join(root, "public/robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
)

console.log(`generated ${pages.length} routes, og images in public/og`)
