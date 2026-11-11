import { readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { assertContent, quizHref, quizzes, resultHref, resultsOf } from "../src/content.js"

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

console.log(`ok ${quizzes.length} tests, ${ogCount} posters`)
