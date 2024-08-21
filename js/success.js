const presenterModal = new bootstrap.Modal(document.querySelector("#presenterModal"))
const video = document.querySelector("#video")
const register = document.querySelector("#register")
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
    })
})
