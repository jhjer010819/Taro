import "./page.js"

const data = JSON.parse(document.querySelector("#quiz-data").textContent)
const stage = document.querySelector("#stage")
let step = 0
const picks = []
let locked = false

function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}

function render() {
  const question = data.questions[step]
  const progress = el("p", "progress", `Q${step + 1} / ${data.questions.length}`)
  const pips = el("div", "pips")
  pips.setAttribute("aria-hidden", "true")
  data.questions.forEach((_, index) => {
    pips.append(el("i", index <= step ? "is-on" : ""))
  })
  const heading = el("h2", "question")
  heading.id = "question-text"
  heading.textContent = question.q
  const choices = el("div", "choices")
  for (const side of ["a", "b"]) {
    const button = el("button", "choice")
    button.type = "button"
    button.dataset.pick = side
    button.append(el("span", "choice__key", side.toUpperCase()), el("span", "choice__text", question[side]))
    button.addEventListener("click", () => choose(side))
    choices.append(button)
  }
  const versus = el("p", "vs", "VS")
  versus.setAttribute("aria-hidden", "true")
  choices.insertBefore(versus, choices.children[1])
  stage.replaceChildren(progress, pips, heading, choices)
}

function choose(side) {
  if (locked) return
  const button = stage.querySelector(`[data-pick="${side}"]`)
  if (!button) return
  locked = true
  for (const choice of stage.querySelectorAll(".choice")) choice.disabled = true
  button.classList.add("is-picked")
  picks.push(side)
  window.setTimeout(() => {
    if (step < data.questions.length - 1) {
      step += 1
      locked = false
      render()
      return
    }
    const score = picks.filter((pick) => pick === "b").length
    const result = data.results.find((item) => score >= item.min && score <= item.max)
    if (!result) {
      stage.textContent = "결과를 찾지 못했다. 홈으로 돌아가라."
      return
    }
    window.location.href = `/result/result-${data.id}-${result.id}.html`
  }, 220)
}

function reset() {
  step = 0
  picks.length = 0
  locked = false
  render()
}

document.querySelector("#restart")?.addEventListener("click", reset)

document.addEventListener("keydown", (event) => {
  const browse = document.querySelector("[data-browse]")
  if (browse && !browse.hidden) return
  if (event.metaKey || event.ctrlKey || event.altKey) return
  const key = event.key.toLowerCase()
  if (key === "a" || key === "1") {
    event.preventDefault()
    choose("a")
  } else if (key === "b" || key === "2") {
    event.preventDefault()
    choose("b")
  }
})

render()
