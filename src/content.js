import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { copyFor } from "./i18n.js"

export const site = {
  name: "타로",
  domain: "taro.mymallow.cloud",
  url: "https://taro.mymallow.cloud",
  tagline: "심심하면 뇌 끄는 테스트장",
}

// First locale is the default and keeps the original URLs (empty prefix).
// Another language is a folder under src/quizzes plus a matching copy block.
export const locales = [
  {
    id: "ko",
    htmlLang: "ko",
    ogLocale: "ko_KR",
    prefix: "",
    label: "한국어",
    dir: null,
  },
  {
    id: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    prefix: "/en",
    label: "English",
    dir: "en",
  },
]

export const defaultLocale = locales[0].id

export function localeById(id) {
  return locales.find((locale) => locale.id === id) ?? locales[0]
}

export const tags = [
  { id: "power", label: "병맛전투력" },
  { id: "trend", label: "트렌드" },
  { id: "bored", label: "심심풀이" },
  { id: "people", label: "인간관계" },
  { id: "food", label: "음식" },
  { id: "work", label: "직장" },
]

const quizDir = join(dirname(fileURLToPath(import.meta.url)), "quizzes")
const sources = new WeakMap()

// Original gallery order. New files sort after these so card tilt stays put.
const galleryOrder = ["power", "reply", "lunch", "quit", "group", "weekend", "trend", "snack-cup"]

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function fail(where, message) {
  throw new Error(`${where}: ${message}`)
}

export function compareGallery(a, b) {
  const rank = (quiz) => {
    const index = galleryOrder.indexOf(quiz.id)
    return index === -1 ? galleryOrder.length : index
  }
  const byRank = rank(a) - rank(b)
  if (byRank !== 0) return byRank
  return String(a.published ?? "").localeCompare(String(b.published ?? "")) || String(a.id ?? "").localeCompare(String(b.id ?? ""))
}

export function quizSource(quiz) {
  return sources.get(quiz) ?? quiz.id
}

export function loadQuizFile(file, where = file) {
  let raw
  try {
    raw = readFileSync(file, "utf8")
  } catch (error) {
    fail(where, error.message)
  }
  let data
  try {
    data = JSON.parse(raw)
  } catch (error) {
    fail(where, error.message)
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) fail(where, "expected a JSON object")
  sources.set(data, where)
  return data
}

export function loadQuizDirectory(dir, label) {
  let names
  try {
    names = readdirSync(dir)
  } catch (error) {
    fail(label, error.message)
  }
  const jsonNames = []
  for (const name of names) {
    if (name.endsWith(".json")) {
      jsonNames.push(name)
      continue
    }
    if (/\.(js|mjs|cjs|jsonc)$/i.test(name)) {
      fail(`${label}/${name}`, "quiz files must be .json so the build can load them")
    }
  }
  const loaded = jsonNames.sort().map((name) => {
    const where = `${label}/${name}`
    const quiz = loadQuizFile(join(dir, name), where)
    const stem = name.slice(0, -".json".length)
    if (quiz.id !== stem) fail(where, `id "${quiz.id ?? ""}" must match the filename`)
    return quiz
  })
  loaded.sort(compareGallery)
  return loaded
}

function loadLocaleQuizzes(locale) {
  const dir = locale.dir ? join(quizDir, locale.dir) : quizDir
  const label = locale.dir ? `src/quizzes/${locale.dir}` : "src/quizzes"
  const loaded = loadQuizDirectory(dir, label)
  for (const quiz of loaded) quiz.locale = locale.id
  return loaded
}

export const quizzesByLocale = Object.fromEntries(locales.map((locale) => [locale.id, loadLocaleQuizzes(locale)]))

export const quizzes = quizzesByLocale[defaultLocale]

export function findQuiz(localeId, id) {
  return quizzesByLocale[localeId]?.find((quiz) => quiz.id === id) ?? null
}

export function resultsOf(quiz) {
  return quiz.kind === "worldcup" ? quiz.fighters : quiz.results
}

export function homeHref(localeId = defaultLocale) {
  const prefix = localeById(localeId).prefix
  return prefix ? `${prefix}/` : "/"
}

export function quizHref(quiz, localeId = quiz?.locale || defaultLocale) {
  return `${localeById(localeId).prefix}/quiz/quiz-${quiz.id}.html`
}

export function resultHref(quiz, result, localeId = quiz?.locale || defaultLocale) {
  return `${localeById(localeId).prefix}/result/result-${quiz.id}-${result.id}.html`
}

export function kindLabel(quiz, localeId = quiz?.locale || defaultLocale) {
  const strings = copyFor(localeId)
  if (quiz.kind === "worldcup") return strings.kindCup
  return strings.kindQuiz(quiz.questions.length)
}

export function tagLabel(id, localeId = defaultLocale) {
  return copyFor(localeId).tags?.[id] ?? tags.find((tag) => tag.id === id)?.label ?? id
}

export function formatHot(n, localeId = defaultLocale) {
  if (localeId !== "ko") {
    if (n >= 1000) {
      const thousands = Math.round((n / 1000) * 10) / 10
      return `${thousands.toFixed(1).replace(/\.0$/, "")}k`
    }
    return new Intl.NumberFormat("en-US").format(n)
  }
  if (n >= 10000) {
    const man = Math.round((n / 10000) * 10) / 10
    return `${man.toFixed(1).replace(/\.0$/, "")}만`
  }
  return new Intl.NumberFormat("ko-KR").format(n)
}

export function resultBounds(result) {
  const hasScore = Object.hasOwn(result, "score")
  const hasMin = Object.hasOwn(result, "min")
  const hasMax = Object.hasOwn(result, "max")
  if (hasScore && (hasMin || hasMax)) {
    throw new Error("use score or min/max, not both")
  }
  if (hasScore) {
    if (!Number.isInteger(result.score)) throw new Error("score must be an integer")
    return { min: result.score, max: result.score }
  }
  if (!hasMin || !hasMax) throw new Error("result needs score, or min and max")
  if (!Number.isInteger(result.min) || !Number.isInteger(result.max)) {
    throw new Error("min and max must be integers")
  }
  if (result.min > result.max) throw new Error("min cannot be greater than max")
  return { min: result.min, max: result.max }
}

export function resultForScore(quiz, score) {
  return quiz.results.find((result) => {
    const { min, max } = resultBounds(result)
    return score >= min && score <= max
  })
}

function assertDate(where, value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    fail(where, "published must be YYYY-MM-DD")
  }
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    fail(where, `published is not a real date (${value})`)
  }
}

function assertResultFields(where, result) {
  if (!result || typeof result !== "object" || Array.isArray(result)) fail(where, "result must be an object")
  if (!idPattern.test(result.id ?? "")) fail(where, `bad result id ${result.id}`)
  for (const key of ["title", "meter", "summary", "comment"]) {
    if (!String(result[key] ?? "").trim()) fail(where, `missing ${key}`)
  }
}

export function assertQuiz(quiz, where = quizSource(quiz)) {
  if (!quiz || typeof quiz !== "object" || Array.isArray(quiz)) fail(where, "expected an object")
  if (!idPattern.test(quiz.id ?? "")) fail(where, `bad quiz id ${quiz.id}`)
  for (const key of ["title", "emoji", "blurb", "published"]) {
    if (!String(quiz[key] ?? "").trim()) fail(where, `missing ${key}`)
  }
  assertDate(where, quiz.published)
  if (!Number.isInteger(quiz.hot) || quiz.hot < 0) fail(where, "hot must be a non-negative integer")
  if (!Array.isArray(quiz.tags) || quiz.tags.length === 0) fail(where, "needs tags")
  for (const tag of quiz.tags) {
    if (!tags.some((item) => item.id === tag)) fail(where, `unknown tag ${tag}`)
  }
  if (quiz.kind === "quiz") {
    if (!Array.isArray(quiz.questions)) fail(where, "questions must be an array")
    if (quiz.questions.length < 3 || quiz.questions.length > 5) {
      fail(where, `needs 3 to 5 questions, got ${quiz.questions.length}`)
    }
    for (const question of quiz.questions) {
      if (!question || typeof question !== "object") fail(where, "incomplete question")
      for (const key of ["q", "a", "b"]) {
        if (!String(question[key] ?? "").trim()) fail(where, "incomplete question")
      }
    }
    if (!Array.isArray(quiz.results)) fail(where, "results must be an array")
    if (quiz.results.length < 3 || quiz.results.length > 6) {
      fail(where, `needs 3 to 6 results, got ${quiz.results.length}`)
    }
    const claimed = new Map()
    const seen = new Set()
    for (const result of quiz.results) {
      assertResultFields(`${where} (${result?.id ?? "?"})`, result)
      if (seen.has(result.id)) fail(where, `duplicate result ${result.id}`)
      seen.add(result.id)
      let bounds
      try {
        bounds = resultBounds(result)
      } catch (error) {
        fail(`${where} (${result.id})`, error.message)
      }
      for (let score = bounds.min; score <= bounds.max; score += 1) {
        if (score < 0 || score > quiz.questions.length) {
          fail(where, `${result.id} score ${score} is outside 0..${quiz.questions.length}`)
        }
        if (claimed.has(score)) {
          fail(where, `score ${score} is claimed by ${claimed.get(score)} and ${result.id}`)
        }
        claimed.set(score, result.id)
      }
    }
    for (let score = 0; score <= quiz.questions.length; score += 1) {
      if (!claimed.has(score)) fail(where, `score ${score} has no result`)
    }
  } else if (quiz.kind === "worldcup") {
    if (!Array.isArray(quiz.fighters)) fail(where, "fighters must be an array")
    if (quiz.fighters.length !== 8) fail(where, `needs 8 fighters, got ${quiz.fighters.length}`)
    const seen = new Set()
    for (const fighter of quiz.fighters) {
      assertResultFields(`${where} (${fighter?.id ?? "?"})`, fighter)
      if (seen.has(fighter.id)) fail(where, `duplicate result ${fighter.id}`)
      seen.add(fighter.id)
      for (const key of ["emoji", "name", "tease"]) {
        if (!String(fighter[key] ?? "").trim()) fail(`${where} (${fighter.id})`, `missing ${key}`)
      }
    }
  } else {
    fail(where, `unknown kind ${quiz.kind}`)
  }
}

function resultMap(quiz) {
  if (quiz.kind === "worldcup") return quiz.fighters.map((fighter) => fighter.id).join(",")
  return quiz.results
    .map((result) => {
      const { min, max } = resultBounds(result)
      return `${result.id}:${min}-${max}`
    })
    .join(",")
}

function assertQuizFolders() {
  let entries
  try {
    entries = readdirSync(quizDir, { withFileTypes: true })
  } catch (error) {
    fail("src/quizzes", error.message)
  }
  const known = new Set(locales.map((locale) => locale.dir).filter(Boolean))
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (known.has(entry.name)) continue
    const names = readdirSync(join(quizDir, entry.name)).filter((name) => name.endsWith(".json"))
    if (names.length) fail(`src/quizzes/${entry.name}`, "folder is not a registered locale in src/content.js")
  }
}

function assertTranslations() {
  const base = quizzesByLocale[defaultLocale]
  for (const locale of locales) {
    if (locale.id === defaultLocale) continue
    copyFor(locale.id)
    for (const quiz of quizzesByLocale[locale.id]) {
      const original = base.find((item) => item.id === quiz.id)
      if (!original) continue
      const where = quizSource(quiz)
      if (original.kind !== quiz.kind) fail(where, `kind must match ${quizSource(original)}`)
      if (resultMap(original) !== resultMap(quiz)) {
        fail(where, `result ids and score ranges must match ${quizSource(original)}`)
      }
    }
  }
}

export function assertContent() {
  assertQuizFolders()
  if (quizzes.length < 4) throw new Error("src/quizzes: need a gallery, not a single test")
  for (const locale of locales) {
    copyFor(locale.id)
    const ids = new Set()
    for (const quiz of quizzesByLocale[locale.id]) {
      const where = quizSource(quiz)
      assertQuiz(quiz, where)
      if (ids.has(quiz.id)) fail(where, `duplicate quiz ${quiz.id}`)
      ids.add(quiz.id)
    }
  }
  assertTranslations()
}

assertContent()
