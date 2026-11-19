import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  assertContent,
  assertQuiz,
  compareGallery,
  findQuiz,
  homeHref,
  loadQuizDirectory,
  loadQuizFile,
  locales,
  quizHref,
  quizSource,
  quizzes,
  quizzesByLocale,
  resultForScore,
  resultHref,
  resultsOf,
  site,
} from "../src/content.js"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
assertContent()

function read(path) {
  return readFileSync(join(root, path), "utf8")
}

function pngSize(path) {
  const buf = readFileSync(join(root, path))
  if (buf.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`${path} is not a png`)
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length }
}

const ui = {
  ko: {
    browse: "다른 테스트 구경하기",
    shareKakao: "카카오톡으로 공유",
    shareLink: "링크 공유하기",
    retry: "다시 하기",
    more: "다른 재미있는 테스트 더보기",
    homeTags: ["#병맛전투력", "#트렌드분석", "#심심풀이"],
    lang: "ko",
    ogLocale: "ko_KR",
    unverified: "",
    copied: "링크를 복사했어요. 대화방에 붙여넣어 보세요.",
  },
  en: {
    browse: "Browse tests",
    shareKakao: "Share to KakaoTalk",
    shareLink: "Copy link",
    retry: "Take it again",
    more: "More unhinged tests",
    homeTags: ["#Food", "#Boredom", "#Chaos power"],
    lang: "en",
    ogLocale: "en_US",
    unverified: "Not science, 100% unverified",
    copied: "Link copied. Paste it in the chat.",
  },
}

function assertOg(html, file) {
  const image = html.match(/property="og:image" content="([^"]+)"/)?.[1]
  if (!image?.startsWith(`${site.url}/og/`)) throw new Error(`${file} og image`)
  const local = image.replace(site.url, "public")
  const size = pngSize(local)
  if (size.width !== 1200 || size.height !== 630) throw new Error(`${local} ${size.width}x${size.height}`)
}

function homePath(locale) {
  return locale.id === "ko" ? "index.html" : `${locale.prefix.slice(1)}/index.html`
}

for (const locale of locales) {
  const strings = ui[locale.id]
  if (!strings) throw new Error(`check.mjs missing UI needles for ${locale.id}`)
  const list = quizzesByLocale[locale.id]
  const home = read(homePath(locale))
  if (!home.includes(`<html lang="${strings.lang}">`)) throw new Error(`${locale.id} home lang`)
  if (!home.includes(`property="og:locale" content="${strings.ogLocale}"`)) throw new Error(`${locale.id} home og locale`)
  if (!home.includes(strings.copied)) throw new Error(`${locale.id} home missing share copy`)
  for (const tag of strings.homeTags) {
    if (!home.includes(tag)) throw new Error(`${locale.id} home missing ${tag}`)
  }
  if (strings.unverified && !home.includes(strings.unverified)) throw new Error(`${locale.id} home missing unverified line`)
  for (const other of locales) {
    if (other.id === locale.id) continue
    const href = `${site.url}${homeHref(other.id)}`
    if (!home.includes(`hreflang="${other.htmlLang}" href="${href}"`)) {
      throw new Error(`${locale.id} home missing hreflang ${other.id}`)
    }
    if (!home.includes(`href="${homeHref(other.id)}"`)) throw new Error(`${locale.id} home missing switch ${other.id}`)
  }
  assertOg(home, homePath(locale))

  for (const quiz of list) {
    if (!home.includes(quiz.title)) throw new Error(`${locale.id} home missing ${quiz.title}`)
    if (!home.includes(quizHref(quiz, locale.id))) throw new Error(`${locale.id} home missing link ${quiz.id}`)
    const playFile = quizHref(quiz, locale.id).slice(1)
    const play = read(playFile)
    if (!play.includes(`<html lang="${strings.lang}">`)) throw new Error(`${playFile} lang`)
    if (!play.includes(strings.browse)) throw new Error(`${playFile} missing browse`)
    if (!play.includes("🏠")) throw new Error(`${playFile} missing home`)
    if (strings.unverified && !play.includes(strings.unverified)) throw new Error(`${playFile} missing unverified line`)
    assertOg(play, playFile)
    for (const other of locales) {
      if (other.id === locale.id) continue
      const twin = findQuiz(other.id, quiz.id)
      if (twin) {
        const href = `${site.url}${quizHref(twin, other.id)}`
        if (!play.includes(`hreflang="${other.htmlLang}" href="${href}"`)) {
          throw new Error(`${playFile} missing hreflang ${other.id}`)
        }
        if (!play.includes(`href="${quizHref(twin, other.id)}"`)) throw new Error(`${playFile} missing switch ${other.id}`)
      } else if (play.includes(`rel="alternate" hreflang="${other.htmlLang}"`)) {
        throw new Error(`${playFile} unexpected hreflang ${other.id}`)
      } else if (!play.includes(`href="${homeHref(other.id)}"`)) {
        throw new Error(`${playFile} missing home switch ${other.id}`)
      }
    }
    if (quiz.kind === "quiz") {
      if (!play.includes("quiz-data")) throw new Error(`${playFile} missing data`)
      for (const question of quiz.questions) {
        if (!play.includes(question.q)) throw new Error(`${playFile} missing question`)
      }
      const payload = JSON.parse(play.match(/id="quiz-data">([\s\S]*?)<\/script>/)[1])
      if (payload.prefix !== locale.prefix) throw new Error(`${playFile} prefix`)
      for (let score = 0; score <= quiz.questions.length; score += 1) {
        const fromContent = resultForScore(quiz, score)
        const fromPage = payload.results.find((item) => score >= item.min && score <= item.max)
        if (!fromContent || fromPage?.id !== fromContent.id) throw new Error(`${quiz.id} ${locale.id} score ${score} mismatch`)
      }
    } else if (!play.includes("cup-data") || !play.includes(quiz.fighters[0].name)) {
      throw new Error(`${playFile} missing bracket`)
    }
    for (const result of resultsOf(quiz)) {
      const file = resultHref(quiz, result, locale.id).slice(1)
      const html = read(file)
      const needles = [result.title, result.summary, result.comment, strings.shareKakao, strings.shareLink, strings.retry]
      const pool = list.filter((item) => item.id !== quiz.id)
      if (pool.length > 0) needles.push(strings.more)
      for (const needle of needles) {
        if (!html.includes(needle)) throw new Error(`${file} missing ${needle}`)
      }
      if (!html.includes(`<html lang="${strings.lang}">`)) throw new Error(`${file} lang`)
      if (!html.includes(`property="og:locale" content="${strings.ogLocale}"`)) throw new Error(`${file} og locale`)
      if (strings.unverified && !html.includes(strings.unverified)) throw new Error(`${file} missing unverified line`)
      const curated = pool.filter((item) => html.includes(item.title))
      const need = Math.min(3, pool.length)
      if (curated.length < need) throw new Error(`${file} curated ${curated.length}`)
      assertOg(html, file)
      for (const other of locales) {
        if (other.id === locale.id) continue
        const twin = findQuiz(other.id, quiz.id)
        const twinResult = twin && resultsOf(twin).some((item) => item.id === result.id)
        if (twinResult) {
          const href = `${site.url}${resultHref(twin, result, other.id)}`
          if (!html.includes(`hreflang="${other.htmlLang}" href="${href}"`)) {
            throw new Error(`${file} missing hreflang ${other.id}`)
          }
        } else if (html.includes(`rel="alternate" hreflang="${other.htmlLang}"`)) {
          throw new Error(`${file} unexpected hreflang ${other.id}`)
        }
      }
    }
  }
}

const sitemap = read("public/sitemap.xml")
for (const locale of locales) {
  const paths = [homeHref(locale.id)]
  for (const quiz of quizzesByLocale[locale.id]) {
    paths.push(quizHref(quiz, locale.id))
    for (const result of resultsOf(quiz)) paths.push(resultHref(quiz, result, locale.id))
  }
  for (const path of paths) {
    const loc = `${site.url}${path}`
    if (!sitemap.includes(`<loc>${loc}</loc>`)) throw new Error(`sitemap missing ${loc}`)
  }
}

const ogCount = readdirSync(join(root, "public/og")).filter((name) => name.endsWith(".png")).length
if (ogCount < 40) throw new Error(`expected posters, got ${ogCount}`)
if (!statSync(join(root, "public/fonts/GmarketSansBold.woff")).size) throw new Error("font missing")

// Same rule as the site: compareGallery keeps the original tilt slots, then
// orders every other file by published date and id. A new JSON file is enough.
function assertQuizFolder(dir, label, loaded) {
  const quizNames = readdirSync(dir).filter((name) => name.endsWith(".json")).sort()
  const fromFiles = quizNames.map((name) => {
    const where = `${label}/${name}`
    const quiz = loadQuizFile(join(dir, name), where)
    const id = name.slice(0, -".json".length)
    if (quiz.id !== id) throw new Error(`${where} id must match the filename`)
    return quiz
  })
  const expected = [...fromFiles].sort(compareGallery).map((quiz) => quiz.id)
  const actual = loaded.map((quiz) => quiz.id)
  if (expected.join() !== actual.join()) {
    throw new Error(`${label} quiz order changed: ${actual.join(",")}`)
  }
  const appearances = new Map()
  for (const id of actual) appearances.set(id, (appearances.get(id) ?? 0) + 1)
  for (const name of quizNames) {
    const id = name.slice(0, -".json".length)
    if (appearances.get(id) !== 1) throw new Error(`${label}/${name} must appear exactly once`)
  }
}

assertQuizFolder(join(root, "src/quizzes"), "src/quizzes", quizzes)
for (const locale of locales) {
  if (!locale.dir) continue
  assertQuizFolder(join(root, "src/quizzes", locale.dir), `src/quizzes/${locale.dir}`, quizzesByLocale[locale.id])
}

const sampleWhere = "scripts/fixtures/five-question.json"
const sample = loadQuizFile(join(root, sampleWhere), sampleWhere)
assertQuiz(sample, sampleWhere)
if (sample.questions.length !== 5) throw new Error(`${sampleWhere} should have 5 questions`)
if (sample.results.length < 3 || sample.results.length > 6) throw new Error(`${sampleWhere} result count`)
if (quizzes.some((quiz) => quiz.id === sample.id)) throw new Error(`${sampleWhere} must not be published`)
const sampleScores = ["low", "low", "mid", "high", "high", "top"]
for (let score = 0; score <= 5; score += 1) {
  const result = resultForScore(sample, score)
  if (result?.id !== sampleScores[score]) throw new Error(`${sampleWhere} score ${score} -> ${result?.id}`)
}

const six = structuredClone(sample)
six.results = [0, 1, 2, 3, 4, 5].map((score) => ({
  id: `bucket${score}`,
  score,
  title: `결과 ${score}`,
  meter: String(score),
  summary: "점수마다 하나",
  comment: "여섯 결과",
}))
assertQuiz(six, "scripts/fixtures/six-results.json")

const three = structuredClone(sample)
three.questions = sample.questions.slice(0, 3)
three.results = [
  { id: "none", score: 0, title: "영", meter: "0", summary: "없음", comment: "영점" },
  { id: "some", min: 1, max: 2, title: "중간", meter: "1-2", summary: "사이", comment: "범위" },
  { id: "all", score: 3, title: "셋", meter: "3", summary: "전부", comment: "끝" },
]
assertQuiz(three, "scripts/fixtures/three-results.json")

function expectThrow(run, needle) {
  try {
    run()
  } catch (error) {
    if (!String(error.message).includes(needle)) {
      throw new Error(`expected "${needle}" in: ${error.message}`)
    }
    return
  }
  throw new Error(`expected an error naming ${needle}`)
}

const scratch = mkdtempSync(join(tmpdir(), "taro-quiz-"))
try {
  writeFileSync(join(scratch, "broken.json"), "{")
  expectThrow(() => loadQuizDirectory(scratch, "src/quizzes"), "src/quizzes/broken.json")
  rmSync(join(scratch, "broken.json"))

  writeFileSync(join(scratch, "mismatch.json"), JSON.stringify({ ...sample, id: "other-id" }))
  expectThrow(() => loadQuizDirectory(scratch, "src/quizzes"), "src/quizzes/mismatch.json")
  rmSync(join(scratch, "mismatch.json"))

  writeFileSync(join(scratch, "oops.js"), "export default {}\n")
  expectThrow(() => loadQuizDirectory(scratch, "src/quizzes"), "src/quizzes/oops.js")
  rmSync(join(scratch, "oops.js"))

  const gap = structuredClone(sample)
  gap.id = "gap"
  gap.results = sample.results.filter((result) => result.id !== "top")
  writeFileSync(join(scratch, "gap.json"), JSON.stringify(gap))
  const [loaded] = loadQuizDirectory(scratch, "src/quizzes")
  expectThrow(() => assertQuiz(loaded, quizSource(loaded)), "src/quizzes/gap.json")
} finally {
  rmSync(scratch, { recursive: true, force: true })
}

const banned = "\uB1CC\uC808"
function scanTree(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      scanTree(full)
      continue
    }
    const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : ""
    if (![".html", ".css", ".js", ".mjs", ".json", ".md", ".svg", ".xml", ".txt", ".webmanifest", ".yml"].includes(ext)) {
      continue
    }
    if (readFileSync(full, "utf8").includes(banned)) throw new Error(`${full.slice(root.length + 1)} contains ${banned}`)
  }
}
scanTree(root)

const readme = read("README.md")
const examples = [...readme.matchAll(/```json\n([\s\S]*?)```/g)].map((match) => JSON.parse(match[1]))
if (examples.length !== 2) throw new Error(`README examples: ${examples.length}`)
for (const example of examples) {
  assertQuiz(example, `README.md (${example.id ?? "?"})`)
  if (quizzes.some((quiz) => quiz.id === example.id)) throw new Error(`README example ${example.id} must not be published`)
}
const readmeQuiz = examples.find((example) => example.kind === "quiz")
const readmeCup = examples.find((example) => example.kind === "worldcup")
if (readmeQuiz?.questions.length !== 5) throw new Error("README quiz example should have 5 questions")
if (readmeCup?.fighters.length !== 8) throw new Error("README worldcup example should have 8 fighters")

const counts = locales.map((locale) => `${locale.id} ${quizzesByLocale[locale.id].length}`).join(", ")
console.log(`ok ${counts}, ${ogCount} posters, sample ${sample.questions.length} questions`)
