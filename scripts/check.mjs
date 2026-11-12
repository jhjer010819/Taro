import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  assertContent,
  assertQuiz,
  loadQuizDirectory,
  loadQuizFile,
  quizHref,
  quizSource,
  quizzes,
  resultForScore,
  resultHref,
  resultsOf,
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

const home = read("index.html")
for (const quiz of quizzes) {
  if (!home.includes(quiz.title)) throw new Error(`home missing ${quiz.title}`)
  if (!home.includes(quizHref(quiz))) throw new Error(`home missing link ${quiz.id}`)
  const play = read(quizHref(quiz).slice(1))
  if (!play.includes("다른 테스트 구경하기")) throw new Error(`${quiz.id} missing browse`)
  if (!play.includes("🏠")) throw new Error(`${quiz.id} missing home`)
  if (quiz.kind === "quiz") {
    if (!play.includes("quiz-data")) throw new Error(`${quiz.id} missing data`)
    for (const question of quiz.questions) {
      if (!play.includes(question.q)) throw new Error(`${quiz.id} missing question`)
    }
    const payload = JSON.parse(play.match(/id="quiz-data">([\s\S]*?)<\/script>/)[1])
    for (let score = 0; score <= quiz.questions.length; score += 1) {
      const fromContent = resultForScore(quiz, score)
      const fromPage = payload.results.find((item) => score >= item.min && score <= item.max)
      if (!fromContent || fromPage?.id !== fromContent.id) throw new Error(`${quiz.id} score ${score} mismatch`)
    }
  } else if (!play.includes("cup-data") || !play.includes(quiz.fighters[0].name)) {
    throw new Error(`${quiz.id} missing bracket`)
  }
  for (const result of resultsOf(quiz)) {
    const file = resultHref(quiz, result).slice(1)
    const html = read(file)
    for (const needle of [result.title, result.summary, result.comment, "카카오톡으로 공유", "링크 공유하기", "다시 하기", "다른 재미있는 테스트 더보기"]) {
      if (!html.includes(needle)) throw new Error(`${file} missing ${needle}`)
    }
    const others = quizzes.filter((item) => item.id !== quiz.id).map((item) => item.title)
    const curated = others.filter((title) => html.includes(title))
    if (curated.length < 3) throw new Error(`${file} curated ${curated.length}`)
    const image = html.match(/property="og:image" content="([^"]+)"/)?.[1]
    if (!image?.startsWith("https://taro.mymallow.cloud/og/")) throw new Error(`${file} og image`)
    const local = image.replace("https://taro.mymallow.cloud", "public")
    const size = pngSize(local)
    if (size.width !== 1200 || size.height !== 630) throw new Error(`${local} ${size.width}x${size.height}`)
  }
}

for (const tag of ["#병맛전투력", "#트렌드분석", "#심심풀이"]) {
  if (!home.includes(tag)) throw new Error(`home missing ${tag}`)
}

const ogCount = readdirSync(join(root, "public/og")).filter((name) => name.endsWith(".png")).length
if (ogCount < 40) throw new Error(`expected posters, got ${ogCount}`)
if (!statSync(join(root, "public/fonts/GmarketSansBold.woff")).size) throw new Error("font missing")

const liveIds = ["power", "reply", "lunch", "quit", "group", "weekend", "trend", "snack-cup", "civil-type"]
if (quizzes.map((quiz) => quiz.id).join() !== liveIds.join()) {
  throw new Error(`quiz order changed: ${quizzes.map((quiz) => quiz.id).join(",")}`)
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

console.log(`ok ${quizzes.length} tests, ${ogCount} posters, sample ${sample.questions.length} questions`)
