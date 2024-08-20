const storage = localStorage
const http = new EasyHTTP()

let session = JSON.parse(storage.getItem("session"))

const createSession = (data) => {
    const storage = localStorage
    let session = []
    session.push(data)
    storage.setItem("session", JSON.stringify(session))
}

const getSessionData = () => {
    const storage = localStorage
    if (storage.getItem("session")) {
        session = JSON.parse(storage.getItem("session"))
        return
    }
    window.location.replace("index.html")
}

const redirect = () => {
    window.location.replace("users.html")
}

const getUserID = () => {
    return session[0].id
}

const prepareEndSession = () => {
    document.querySelector("#exit").addEventListener("click", () => {
        window.location.replace("index.html")
        localStorage.clear()
    })
}
