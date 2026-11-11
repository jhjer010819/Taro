import "./page.js"

const data = JSON.parse(document.querySelector("#cup-data").textContent)
const stage = document.querySelector("#stage")
let current = data.fighters.slice()
let matchIndex = 0
let winners = []
let locked = false

function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}

function roundName(size) {
  if (size === 2) return "결승"
  return `${size}강`
}

function render() {
  const left = current[matchIndex * 2]
  const right = current[matchIndex * 2 + 1]
  const total = current.length / 2
  const progress = el("p", "progress", `${roundName(current.length)} · ${matchIndex + 1} / ${total}`)
  const heading = el("h2", "question", "더 당기는 쪽을 찍어라.")
  const choices = el("div", "choices")
  for (const fighter of [left, right]) {
    const button = el("button", "choice choice--food")
    button.type = "button"
    button.dataset.pick = fighter.id
    const text = el("span", "choice__text")
    text.append(el("strong", "", fighter.name), el("small", "", fighter.tease))
    button.append(el("span", "choice__key choice__key--emoji", fighter.emoji), text)
    button.addEventListener("click", () => pick(fighter.id))
    choices.append(button)
  }
  const versus = el("p", "vs", "VS")
  versus.setAttribute("aria-hidden", "true")
  choices.insertBefore(versus, choices.children[1])
  stage.replaceChildren(progress, heading, choices)
}

function pick(id) {
  if (locked) return
  const fighter = current.find((item) => item.id === id)
  const button = stage.querySelector(`[data-pick="${id}"]`)
  if (!fighter || !button) return
  locked = true
  for (const choice of stage.querySelectorAll(".choice")) choice.disabled = true
  button.classList.add("is-picked")
  window.setTimeout(() => {
    winners.push(fighter)
    const matches = current.length / 2
    matchIndex += 1
    if (matchIndex < matches) {
      locked = false
      render()
      return
    }
    if (winners.length === 1) {
      window.location.href = `/result/result-${data.id}-${winners[0].id}.html`
      return
    }
    current = winners
    winners = []
    matchIndex = 0
    locked = false
    render()
  }, 220)
}

function reset() {
  current = data.fighters.slice()
  winners = []
  matchIndex = 0
  locked = false
  render()
}

document.querySelector("#restart")?.addEventListener("click", reset)

document.addEventListener("keydown", (event) => {
  const browse = document.querySelector("[data-browse]")
  if (browse && !browse.hidden) return
  if (event.metaKey || event.ctrlKey || event.altKey) return
  const buttons = [...stage.querySelectorAll(".choice")]
  if (event.key === "a" || event.key === "1" || event.key === "ArrowLeft") {
    event.preventDefault()
    buttons[0]?.click()
  } else if (event.key === "b" || event.key === "2" || event.key === "ArrowRight") {
    event.preventDefault()
    buttons[1]?.click()
  }
})

render()
