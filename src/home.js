import "./page.js"

const gallery = document.querySelector("#gallery")
const empty = document.querySelector("#empty")
if (gallery) {
  const cards = [...gallery.querySelectorAll(".card")]
  let sort = "hot"
  let tag = "all"

  function apply() {
    const visible = cards.filter((card) => {
      if (tag === "all") return true
      return card.dataset.tags.split(",").includes(tag)
    })
    visible.sort((a, b) => {
      if (sort === "new") return b.dataset.date.localeCompare(a.dataset.date) || Number(b.dataset.hot) - Number(a.dataset.hot)
      return Number(b.dataset.hot) - Number(a.dataset.hot)
    })
    for (const card of cards) {
      card.hidden = true
      card.classList.remove("card--feature")
    }
    visible.forEach((card, index) => {
      card.hidden = false
      if (index === 0 && sort === "hot" && tag === "all") card.classList.add("card--feature")
      gallery.append(card)
    })
    if (empty) empty.hidden = visible.length !== 0
  }

  for (const button of document.querySelectorAll("[data-sort]")) {
    button.addEventListener("click", () => {
      sort = button.dataset.sort
      for (const other of document.querySelectorAll("[data-sort]")) {
        other.setAttribute("aria-selected", other === button ? "true" : "false")
      }
      apply()
    })
  }

  for (const button of document.querySelectorAll("[data-tag]")) {
    button.addEventListener("click", () => {
      tag = button.dataset.tag
      for (const other of document.querySelectorAll("[data-tag]")) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false")
      }
      apply()
    })
  }
}
