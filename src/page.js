import "./styles.css"

const sheet = document.querySelector("[data-browse]")
const toast = document.querySelector("[data-toast]")
let toastTimer = 0
let lastOpener = null

function showToast(message) {
  if (!toast) return
  toast.textContent = message
  toast.classList.add("is-on")
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => toast.classList.remove("is-on"), 2600)
}

function openSheet(opener) {
  if (!sheet) return
  lastOpener = opener instanceof HTMLElement ? opener : null
  sheet.hidden = false
  document.body.classList.add("is-locked")
  sheet.querySelector("[data-close-browse]")?.focus()
}

function closeSheet() {
  if (!sheet || sheet.hidden) return
  sheet.hidden = true
  document.body.classList.remove("is-locked")
  lastOpener?.focus()
}

for (const button of document.querySelectorAll("[data-open-browse]")) {
  button.addEventListener("click", () => openSheet(button))
}

sheet?.querySelectorAll("[data-close-browse]").forEach((node) => {
  node.addEventListener("click", closeSheet)
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSheet()
})

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement("textarea")
    area.value = text
    area.setAttribute("readonly", "")
    area.style.position = "fixed"
    area.style.left = "-9999px"
    document.body.appendChild(area)
    area.select()
    let ok = false
    try {
      ok = document.execCommand("copy")
    } catch {
      ok = false
    }
    area.remove()
    return ok
  }
}

function sharePayload(button) {
  const url = new URL(button.dataset.path, window.location.origin).href
  return {
    url,
    title: button.dataset.title || document.title,
    text: button.dataset.text || "",
    image: new URL(button.dataset.image || "/og/home.png", window.location.origin).href,
  }
}

async function shareKakao(button) {
  const payload = sharePayload(button)
  const key = document.documentElement.dataset.kakaoKey?.trim()
  if (key && window.Kakao) {
    if (!window.Kakao.isInitialized()) window.Kakao.init(key)
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: payload.title,
        description: payload.text,
        imageUrl: payload.image,
        link: { mobileWebUrl: payload.url, webUrl: payload.url },
      },
      buttons: [
        {
          title: "나도 해보기",
          link: { mobileWebUrl: payload.url, webUrl: payload.url },
        },
      ],
    })
    return
  }

  if (navigator.share) {
    try {
      await navigator.share({ title: payload.title, text: payload.text, url: payload.url })
      return
    } catch (error) {
      if (error?.name === "AbortError") return
    }
  }

  const ok = await copyText(`${payload.text}\n${payload.url}`)
  showToast(ok ? "카톡에 붙여넣을 링크를 복사했다." : "복사가 막혀 있다. 주소창을 길게 눌러라.")
}

for (const button of document.querySelectorAll("[data-share]")) {
  button.addEventListener("click", async () => {
    if (button.dataset.share === "link") {
      const payload = sharePayload(button)
      const ok = await copyText(payload.url)
      showToast(ok ? "링크 복사 완료. 단톡에 던져라." : "복사가 막혀 있다. 주소를 직접 복사해라.")
      return
    }
    await shareKakao(button)
  })
}
