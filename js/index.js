const registerModal = new bootstrap.Modal(document.querySelector("#registerModal"))
const presenterModal = new bootstrap.Modal(document.querySelector("#presenterModal"))
const loginModal = new bootstrap.Modal(document.querySelector("#loginModal"))
const video = document.querySelector("#video")
const register = document.querySelector("#register")
const form = document.querySelector("form")
const presenterBlocks = document.querySelectorAll(".presenter-blocks")
const presentedByLinks = document.querySelectorAll(".presented-by-links")

presenterBlocks.forEach((block) => {
    block.addEventListener("click", (e) => {
        e.preventDefault()
        presenterModal.show()
    })
})

presentedByLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        loginModal.show()
    })
})

register.addEventListener("click", () => {
    form.reset()
})

video.addEventListener("click", () => {
    registerModal.show()
    form.reset()
})

form.addEventListener("submit", (e) => {
    iframe = document.querySelector("iframe")
    e.preventDefault()
    video.classList.add("d-none")
    iframe.classList.remove("d-none")
    registerModal.hide()
})
