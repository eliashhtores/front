let server = "http://localhost:5000"
if (window.location.hostname !== "127.0.0.1") server = "https://back-gjd8.onrender.com"

const url = `${server}/user`
const form = document.querySelector("form")
const toastWarning = new bootstrap.Toast(document.querySelector("#toastWarning"))
const toastWarningBody = document.querySelector("#toastWarningBody")

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    const loginButton = document.querySelector("#login")
    loginButton.disabled = true
    loginButton.innerText = "Ingresando"

    http.post(`${url}/validate`, data).then((response) => {
        if (response.status === 200) {
            createSession(response.user)
            redirect()
            return
        }
        loginButton.disabled = false
        loginButton.innerText = "Ingresar"
        toastWarningBody.innerHTML = "Favor de revisar su usuario y contraseña"
        toastWarning.show()
    })
})
