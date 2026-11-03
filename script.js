const root = document.documentElement
const toggle = document.querySelector("#switch")
const avatar = document.querySelector("#avatar img")
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches

/* tema claro/escuro */
function applyTheme() {
  const isLight = root.classList.contains("light")
  toggle.setAttribute("aria-pressed", String(isLight))
  avatar.src = isLight ? "./assets/avatar-light.png" : "./assets/avatar.png"
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", isLight ? "#eef2f0" : "#07090c")
}

function toggleMode() {
  root.classList.toggle("light")
  try {
    localStorage.setItem("theme", root.classList.contains("light") ? "light" : "dark")
  } catch (e) {}
  applyTheme()
}

toggle.addEventListener("click", toggleMode)
applyTheme()

/* efeito de digitação */
const typed = document.querySelector("#typed")
const phrases = [
  typed.dataset.text,
  "nmap -sC -sV alvo → relatórios claros",
  "AWS · OCI · Linux · Redes",
]

if (reduceMotion) {
  typed.textContent = phrases[0]
} else {
  let phrase = 0
  let char = 0
  let deleting = false

  function type() {
    const text = phrases[phrase]
    char += deleting ? -1 : 1
    typed.textContent = text.slice(0, char)

    let delay = deleting ? 25 : 55
    if (!deleting && char === text.length) {
      deleting = true
      delay = 2200
    } else if (deleting && char === 0) {
      deleting = false
      phrase = (phrase + 1) % phrases.length
      delay = 400
    }
    setTimeout(type, delay)
  }
  setTimeout(type, 600)
}

/* chuva hexadecimal no fundo */
const canvas = document.querySelector("#matrix")
const ctx = canvas.getContext("2d")
const glyphs = "0123456789ABCDEF<>/{}$#"
const size = 16
let columns = []

function resize() {
  canvas.width = innerWidth
  canvas.height = innerHeight
  columns = Array.from({ length: Math.ceil(canvas.width / size) }, () =>
    Math.floor((Math.random() * canvas.height) / size)
  )
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = getComputedStyle(root).getPropertyValue("--matrix").trim()
  ctx.font = `${size}px "JetBrains Mono", monospace`

  columns.forEach((y, i) => {
    for (let k = 0; k < 8; k++) {
      ctx.globalAlpha = 1 - k / 8
      const g = glyphs[Math.floor(Math.random() * glyphs.length)]
      ctx.fillText(g, i * size, (y - k) * size)
    }
    columns[i] = y * size > canvas.height && Math.random() > 0.97 ? 0 : y + 1
  })
  ctx.globalAlpha = 1
}

resize()
addEventListener("resize", resize)

if (reduceMotion) {
  draw()
} else {
  setInterval(draw, 90)
}
