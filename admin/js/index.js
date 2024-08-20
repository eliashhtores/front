const url = "http://localhost:5000/user"
const form = document.querySelector("form")
const toastWarning = new bootstrap.Toast(document.querySelector("#toastWarning"))
const toastWarningBody = document.querySelector("#toastWarningBody")

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    http.post(`${url}/validate`, data).then((response) => {
        if (response.status === 200) {
            createSession(response.user)
            redirect()
            return
        } else {
            toastWarningBody.innerHTML = "Favor de revisar su usuario y contraseña"
            toastWarning.show()
        }
    })
})
