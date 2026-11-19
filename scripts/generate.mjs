import { createHash } from "node:crypto"
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { Resvg } from "@resvg/resvg-js"
import {
  assertContent,
  defaultLocale,
  findQuiz,
  formatHot,
  homeHref,
  kindLabel,
  localeById,
  locales,
  quizHref,
  quizzesByLocale,
  resultBounds,
  resultHref,
  resultsOf,
  site,
  tagLabel,
  tags,
} from "../src/content.js"
import { copyFor } from "../src/i18n.js"

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

function isMostlyLatin(text) {
  let latin = 0
  let hangul = 0
  for (const ch of String(text)) {
    if (/[A-Za-z]/.test(ch)) latin += 1
    else if (/[\uac00-\ud7af]/.test(ch)) hangul += 1
  }
  return latin > hangul
}

function lineMax(text, cjkMax) {
  if (!isMostlyLatin(text)) return cjkMax
  return Math.max(cjkMax, 34)
}

function wrapTitle(title, max = 10) {
  const limit = isMostlyLatin(title) ? Math.max(max, 22) : max
  if (chars(title).length <= limit + 1) return [title]
  if (!title.includes(" ")) {
    const all = chars(title)
    const mid = Math.ceil(all.length / 2)
    return [all.slice(0, mid).join(""), all.slice(mid).join("")]
  }
  const lines = []
  let current = ""
  for (const word of title.split(" ")) {
    const next = current ? `${current} ${word}` : word
    if (chars(next).length > limit && current) {
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

function quizPosterLayout(lines) {
  if (lines.length >= 3) return { size: 50, firstY: 208, blurbY: 420 }
  if (lines.length > 1) return { size: 58, firstY: 250, blurbY: 400 }
  return { size: 72, firstY: 280, blurbY: 360 }
}

function resultPosterLayout(lines) {
  if (lines.length >= 3) return { size: 46, firstY: 200 }
  if (lines.length > 1) return { size: 58, firstY: 236 }
  return { size: 76, firstY: 286 }
}

function fitCorner(text) {
  const max = isMostlyLatin(text) ? 22 : 32
  const all = chars(text)
  if (all.length <= max) return text
  if (!String(text).includes(" ")) return all.slice(0, max).join("")
  let current = ""
  for (const word of String(text).split(" ")) {
    const next = current ? `${current} ${word}` : word
    if ([...next].length > max) break
    current = next
  }
  return current || all.slice(0, max).join("")
}

function cornerFontSize(text) {
  const count = chars(text).length
  if (!isMostlyLatin(text) && count <= 24) return 28
  if (count <= 18) return 28
  if (count <= 26) return 22
  return 18
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
  <text x="1090" y="112" text-anchor="end" font-family="Gmarket Sans" font-size="${cornerFontSize(corner)}" font-weight="700" fill="#141414">${xml(corner)}</text>
  ${headlines}
  ${meterMarkup}
  ${blurbs}
  <rect x="28" y="524" width="1144" height="78" fill="#141414"/>
  <text x="600" y="574" text-anchor="middle" font-family="Gmarket Sans" font-size="32" font-weight="700" fill="#ffe600">${xml(site.domain)}</text>
</svg>`
}

function relatedTo(quiz, list) {
  return list
    .filter((other) => other.id !== quiz.id)
    .map((other) => ({
      other,
      score: other.tags.filter((tag) => quiz.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.other.hot - a.other.hot)
    .slice(0, 3)
    .map((row) => row.other)
}

function card(quiz, list, locale, t, { feature = false, stamps = [] } = {}) {
  const tilt = tilts[list.findIndex((item) => item.id === quiz.id) % tilts.length]
  const stampHtml = stamps
    .map((stamp) => `<span class="mini-stamp${stamp === t.stampNew ? " mini-stamp--new" : ""}">${esc(stamp)}</span>`)
    .join("")
  const tagHtml = quiz.tags.map((id) => `<span>#${esc(tagLabel(id, locale.id))}</span>`).join("")
  return `<a class="card${feature ? " card--feature" : ""}" href="${quizHref(quiz, locale.id)}" data-hot="${quiz.hot}" data-date="${quiz.published}" data-tags="${quiz.tags.join(",")}" style="--tilt:${tilt}deg">
    <div class="card__stamps">${stampHtml}</div>
    <p class="card__emoji">${quiz.emoji}</p>
    <p class="card__kind">${esc(kindLabel(quiz, locale.id))}</p>
    <h3>${esc(quiz.title)}</h3>
    <p class="card__blurb">${esc(quiz.blurb)}</p>
    <p class="card__tags">${tagHtml}</p>
    <p class="card__meta"><span>${esc(formatHot(quiz.hot, locale.id))} ${esc(t.played)}</span><span>${esc(t.start)}</span></p>
  </a>`
}

function pageExists(localeId, page) {
  if (page.type === "home" || page.type === "info") return true
  if (page.type === "quiz") return Boolean(findQuiz(localeId, page.id))
  if (page.type === "result") {
    const quiz = findQuiz(localeId, page.id)
    return Boolean(quiz && resultsOf(quiz).some((result) => result.id === page.resultId))
  }
  return false
}

function resolvePage(localeId, page) {
  if (page.type === "home" || page.type === "miss") return homeHref(localeId)
  if (page.type === "info") return `${localeById(localeId).prefix}/${page.slug}.html`
  const quiz = findQuiz(localeId, page.id)
  if (!quiz) return homeHref(localeId)
  if (page.type === "quiz") return quizHref(quiz, localeId)
  const result = resultsOf(quiz).find((item) => item.id === page.resultId)
  if (!result) return quizHref(quiz, localeId)
  return resultHref(quiz, result, localeId)
}

function alternateLinks(page) {
  const ready = locales.filter((locale) => pageExists(locale.id, page))
  if (ready.length < 2) return ""
  const tagsForPage = ready.map((locale) => {
    const href = `${site.url}${resolvePage(locale.id, page)}`
    return `<link rel="alternate" hreflang="${locale.htmlLang}" href="${esc(href)}" />`
  })
  const fallback = `${site.url}${resolvePage(defaultLocale, page)}`
  tagsForPage.push(`<link rel="alternate" hreflang="x-default" href="${esc(fallback)}" />`)
  return tagsForPage.join("\n  ")
}

function langSwitch(locale, t, page) {
  const parts = locales.map((item) => {
    if (item.id === locale.id) return `<span aria-current="true">${esc(item.label)}</span>`
    const href = resolvePage(item.id, page)
    return `<a href="${esc(href)}" hreflang="${item.htmlLang}" lang="${item.htmlLang}">${esc(item.label)}</a>`
  })
  return `<nav class="lang-switch" aria-label="${esc(t.langLabel)}">${parts.join('<span class="lang-switch__slash" aria-hidden="true">/</span>')}</nav>`
}

function header(locale, t, page) {
  const home = homeHref(locale.id)
  return `<header class="topbar">
    <a class="chip chip--home" href="${home}">🏠 <span>${esc(t.home)}</span></a>
    <div class="brand-wrap">
      <a class="brand" href="${home}">${esc(t.siteName)}</a>
      ${langSwitch(locale, t, page)}
    </div>
    <button type="button" class="chip chip--browse" data-open-browse>🔍 ${esc(t.browse)}</button>
  </header>`
}

function footer(locale, t) {
  const prefix = locale.prefix
  return `<footer class="site-footer">
    <p>${esc(t.siteName)} · ${esc(site.domain)}</p>
    <p>${esc(t.footerNote)}</p>
    <nav class="site-footer__links" aria-label="${esc(t.footerNav)}">
      <a href="${prefix}/about.html">${esc(t.about)}</a>
      <a href="${prefix}/privacy.html">${esc(t.privacy)}</a>
      <a href="${prefix}/terms.html">${esc(t.terms)}</a>
    </nav>
    <p>${esc(t.fontCredit)}</p>
  </footer>`
}

function sheet(list, locale, t, currentId) {
  const items = [...list].sort((a, b) => b.hot - a.hot)
  const rows = items
    .map((quiz) => {
      const current = quiz.id === currentId ? ` aria-current="page"` : ""
      const here = quiz.id === currentId ? t.here : ""
      const label = quiz.tags.map((id) => `#${esc(tagLabel(id, locale.id))}`).join(" ")
      return `<li><a href="${quizHref(quiz, locale.id)}"${current}><span class="sheet__emoji">${quiz.emoji}</span><span class="sheet__title">${esc(quiz.title)}${here}</span><span>${esc(kindLabel(quiz, locale.id))} · ${label}</span></a></li>`
    })
    .join("")
  return `<div class="sheet" data-browse hidden>
    <div class="sheet__backdrop" data-close-browse></div>
    <div class="sheet__panel" role="dialog" aria-modal="true" aria-labelledby="browse-title">
      <div class="sheet__head">
        <h2 id="browse-title">${esc(t.browse)}</h2>
        <button type="button" class="chip" data-close-browse>${esc(t.close)}</button>
      </div>
      <ul class="sheet__list">${rows}</ul>
    </div>
  </div>`
}

function shell({ locale, t, title, description, path, image, script, json, main, banner = "", currentId = "", robots = "", page }) {
  const canonical = `${site.url}${path}`
  const imageUrl = `${site.url}${image}`
  const robotMeta = robots ? `<meta name="robots" content="${esc(robots)}" />` : ""
  const data = json ? `<script type="application/json" id="${json.id}">${json.body}</script>` : ""
  const siteCopy = `<script type="application/json" id="site-copy">${JSON.stringify(t.client).replaceAll("<", "\\u003c")}</script>`
  const alternates = alternateLinks(page)
  const list = quizzesByLocale[locale.id]
  return `<!doctype html>
<html lang="${locale.htmlLang}">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-318MMGWL1K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-318MMGWL1K');
</script>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="theme-color" content="#ffe600" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  ${robotMeta}
  <link rel="canonical" href="${esc(canonical)}" />${alternates ? `\n  ${alternates}` : ""}
  <meta property="og:locale" content="${locale.ogLocale}" />
  <meta property="og:site_name" content="${esc(t.siteName)}" />
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
  <a class="skip" href="#content">${esc(t.skip)}</a>
  ${header(locale, t, page)}
  ${banner}
  <main id="content" class="wrap">
    ${main}
  </main>
  ${footer(locale, t)}
  ${sheet(list, locale, t, currentId)}
  <div class="toast" data-toast role="status"></div>
  ${siteCopy}
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

function posterName(locale, name) {
  return locale.id === defaultLocale ? name : `${locale.id}-${name}`
}

function homeFile(locale) {
  return locale.prefix ? join(root, locale.prefix.slice(1), "index.html") : join(root, "index.html")
}

emptyDir(join(root, "public/og"))
emptyDir(join(root, "quiz"))
emptyDir(join(root, "result"))
for (const locale of locales) {
  if (!locale.prefix) continue
  const folder = locale.prefix.replace(/^\//, "")
  emptyDir(join(root, folder, "quiz"))
  emptyDir(join(root, folder, "result"))
}

const routes = []
function addRoute(path, page) {
  routes.push({ path, page })
}

for (const locale of locales) {
  const list = quizzesByLocale[locale.id]
  const t = copyFor(locale.id)
  const homeImage = saveImage(
    poster({
      kicker: t.kickerHome,
      corner: t.cornerHome,
      lines: [t.siteName],
      size: 140,
      firstY: 280,
      blurbLines: wrapByWidth(t.tagline, lineMax(t.tagline, 18)),
      blurbY: 360,
    }),
    posterName(locale, "home"),
  )

  addRoute(homeHref(locale.id), { type: "home" })
  addRoute(`${locale.prefix}/404.html`, { type: "miss" })

  for (const quiz of list) {
    const quizLines = wrapTitle(quiz.title, 11)
    const quizLayout = quizPosterLayout(quizLines)
    const quizImage = saveImage(
      poster({
        kicker: quiz.kind === "worldcup" ? t.kickerCup : t.kickerQuiz,
        corner: fitCorner(kindLabel(quiz, locale.id)),
        lines: quizLines,
        size: quizLayout.size,
        firstY: quizLayout.firstY,
        blurbLines: wrapByWidth(quiz.blurb, lineMax(quiz.blurb, 24)).slice(0, 2),
        blurbY: quizLayout.blurbY,
      }),
      posterName(locale, `quiz-${quiz.id}-${hash(quiz.title + quiz.blurb)}`),
    )
    const quizPath = quizHref(quiz, locale.id)
    addRoute(quizPath, { type: "quiz", id: quiz.id })

    const tagHtml = quiz.tags.map((id) => `<span>#${esc(tagLabel(id, locale.id))}</span>`).join("")
    const unverified = t.unverified ? `\n    <p class="unverified">${esc(t.unverified)}</p>` : ""
    const play = `<article class="play">
    <p class="kicker tag-row">${tagHtml}<span>${esc(kindLabel(quiz, locale.id))}</span></p>
    <h1>${esc(quiz.title)}</h1>
    <p class="lede">${esc(quiz.blurb)}</p>${unverified}
    <div id="stage" class="stage" aria-live="polite">
      <p>${esc(t.preparing)}</p>
    </div>
    <p class="fineprint"><button type="button" class="text-button" id="restart">${esc(t.restart)}</button></p>
  </article>`

    if (quiz.kind === "quiz") {
      const payload = {
        id: quiz.id,
        prefix: locale.prefix,
        missingResult: t.missingResult,
        questions: quiz.questions,
        results: quiz.results.map((result) => ({ id: result.id, ...resultBounds(result) })),
      }
      write(
        out(quizPath),
        shell({
          locale,
          t,
          title: `${quiz.title} | ${t.siteName}`,
          description: quiz.blurb,
          path: quizPath,
          image: quizImage,
          script: "/src/quiz.js",
          currentId: quiz.id,
          page: { type: "quiz", id: quiz.id },
          json: { id: "quiz-data", body: JSON.stringify(payload).replaceAll("<", "\\u003c") },
          main: play,
        }),
      )
    } else {
      const payload = {
        id: quiz.id,
        prefix: locale.prefix,
        prompt: t.cupPrompt,
        finalRound: t.cupFinal,
        roundTemplate: t.cupRoundTemplate,
        fighters: quiz.fighters.map(({ id, emoji, name, tease }) => ({ id, emoji, name, tease })),
      }
      write(
        out(quizPath),
        shell({
          locale,
          t,
          title: `${quiz.title} | ${t.siteName}`,
          description: quiz.blurb,
          path: quizPath,
          image: quizImage,
          script: "/src/worldcup.js",
          currentId: quiz.id,
          page: { type: "quiz", id: quiz.id },
          json: { id: "cup-data", body: JSON.stringify(payload).replaceAll("<", "\\u003c") },
          main: play,
        }),
      )
    }

    for (const result of resultsOf(quiz)) {
      const lines = wrapTitle(result.title, 10)
      const layout = resultPosterLayout(lines)
      const image = saveImage(
        poster({
          kicker: t.kickerResult,
          corner: fitCorner(quiz.title),
          lines,
          size: layout.size,
          firstY: layout.firstY,
          meter: result.meter,
        }),
        posterName(locale, `${quiz.id}-${result.id}-${hash(result.title + result.meter + result.comment)}`),
      )
      const href = resultHref(quiz, result, locale.id)
      addRoute(href, { type: "result", id: quiz.id, resultId: result.id })
      const shareTitle = `${result.title} — ${quiz.title}`
      const shareText = t.shareText(quiz.title, result.title)
      const actions = `<div class="actions">
      <button type="button" class="b-class-button" data-share="kakao" data-path="${href}" data-title="${esc(shareTitle)}" data-text="${esc(shareText)}" data-image="${image}">🔗 ${esc(t.shareKakao)}</button>
      <button type="button" class="b-class-button" data-share="link" data-path="${href}" data-title="${esc(shareTitle)}" data-text="${esc(shareText)}" data-image="${image}">🔗 ${esc(t.shareLink)}</button>
      <a class="b-class-button" href="${quizHref(quiz, locale.id)}">🔄 ${esc(t.retry)}</a>
    </div>`
      const related = relatedTo(quiz, list)
      const more = related.length
        ? `<section class="more">
      <h2>⚡ ${esc(t.more)}</h2>
      <div class="more__grid">${related.map((item) => card(item, list, locale, t)).join("")}</div>
    </section>`
        : ""
      const resultBadge = t.unverified ? `\n          <p class="unverified">${esc(t.unverified)}</p>` : ""
      const main = `<article class="result-layout">
      <article class="result-card">
        <img src="${image}" alt="" width="1200" height="630" />
        <div class="result-card__body">
          <p class="stamp stamp--result">🎯 ${esc(t.finalResult)}</p>
          <p class="kicker"><a href="${quizHref(quiz, locale.id)}">${esc(quiz.title)}</a></p>
          <h1>${esc(result.title)}</h1>
          <p class="meter">${esc(result.meter)}</p>
          <p class="summary">${esc(result.summary)}</p>
          <div class="comment">
            <p class="comment__label">${esc(t.commentLabel)}</p>
            <p>${esc(result.comment)}</p>
          </div>${resultBadge}
        </div>
      </article>
      ${actions}
      ${more}
    </article>`
      write(
        out(href),
        shell({
          locale,
          t,
          title: `${shareTitle} | ${t.siteName}`,
          description: result.comment,
          path: href,
          image,
          script: "/src/page.js",
          currentId: quiz.id,
          page: { type: "result", id: quiz.id, resultId: result.id },
          main,
        }),
      )
    }
  }

  const byHot = [...list].sort((a, b) => b.hot - a.hot)
  const newestId = byHot.length ? [...list].sort((a, b) => b.published.localeCompare(a.published))[0].id : ""
  const popularIds = new Set(byHot.slice(0, 2).map((quiz) => quiz.id))
  const gallery = byHot
    .map((quiz) => {
      const stamps = []
      if (popularIds.has(quiz.id)) stamps.push(t.stampHot)
      if (quiz.id === newestId) stamps.push(t.stampNew)
      return card(quiz, list, locale, t, { feature: quiz.id === byHot[0].id, stamps })
    })
    .join("")
  const tagButtons = [
    `<button type="button" class="tag-button" data-tag="all" aria-pressed="true">${esc(t.tagAll)}</button>`,
    ...tags.map(
      (tag) =>
        `<button type="button" class="tag-button" data-tag="${tag.id}" aria-pressed="false">#${esc(tagLabel(tag.id, locale.id))}</button>`,
    ),
  ].join("")
  const heroBadge = t.unverified ? `\n      <p class="unverified">${esc(t.unverified)}</p>` : ""
  const home = shell({
    locale,
    t,
    title: t.homeTitle,
    description: t.homeDescription,
    path: homeHref(locale.id),
    image: homeImage,
    script: "/src/home.js",
    page: { type: "home" },
    banner: `<div class="marquee" aria-hidden="true"><div class="marquee__track"><span>${t.ticker}</span><span>${t.ticker}</span></div></div>`,
    main: `<section class="hero">
    <div class="hero__card">
      <p class="stamp stamp--blue">${esc(t.stampScience)}</p>
      <p class="stamp stamp--pink">${esc(t.stampGrade)}</p>
      <p class="hero__domain">${esc(site.domain)}</p>
      <h1>${esc(t.siteName)}</h1>
      <p class="hero__tagline">${esc(t.tagline)}</p>
      <p class="hero__desc">${esc(t.heroDesc)}</p>${heroBadge}
    </div>
  </section>
  <section>
    <div class="section-head">
      <h2>${esc(t.galleryTitle)}</h2>
      <p>${esc(t.galleryDesc)}</p>
    </div>
    <div class="controls">
      <div class="sorts" role="tablist" aria-label="${esc(t.sortLabel)}">
        <button type="button" class="sort-button" role="tab" data-sort="hot" aria-selected="true">${esc(t.sortHot)}</button>
        <button type="button" class="sort-button" role="tab" data-sort="new" aria-selected="false">${esc(t.sortNew)}</button>
      </div>
      <div class="tags">${tagButtons}</div>
    </div>
    <div class="grid" id="gallery">${gallery}</div>
    <p id="empty" class="empty" hidden>${esc(t.empty)}</p>
  </section>`,
  })
  write(homeFile(locale), home)

  write(
    out(`${locale.prefix}/404.html`),
    shell({
      locale,
      t,
      title: t.miss.title,
      description: t.miss.description,
      path: `${locale.prefix}/404.html`,
      image: homeImage,
      script: "/src/page.js",
      robots: "noindex",
      page: { type: "miss" },
      main: `<section class="miss">
      <p class="stamp stamp--result">${esc(t.miss.stamp)}</p>
      <h1>${esc(t.miss.heading)}</h1>
      <p>${esc(t.miss.body)}</p>
      <div class="actions"><a class="b-class-button" href="${homeHref(locale.id)}">🏠 ${esc(t.miss.home)}</a></div>
    </section>`,
    }),
  )

  for (const info of t.infoPages) {
    const path = `${locale.prefix}/${info.slug}.html`
    addRoute(path, { type: "info", slug: info.slug })
    write(
      out(path),
      shell({
        locale,
        t,
        title: info.title,
        description: info.description,
        path,
        image: homeImage,
        script: "/src/page.js",
        page: { type: "info", slug: info.slug },
        main: info.main,
      }),
    )
  }
}

const urls = routes.map(({ path }) => `  <url><loc>${site.url}${path}</loc></url>`).join("\n")
write(
  join(root, "public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
write(join(root, "public/robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)

const counts = locales.map((locale) => `${locale.id} ${quizzesByLocale[locale.id].length}`).join(", ")
console.log(`generated ${routes.length} routes (${counts}), og images in public/og`)
