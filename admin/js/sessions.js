let url = "http://localhost:5000/session"
let id = "",
    mode
const tbody = document.querySelector("tbody")
const form = document.querySelector("form")
const sessionModal = new bootstrap.Modal(document.querySelector("#sessionModal"))
const toastSuccess = new bootstrap.Toast(document.querySelector("#toastSuccess"))
const toastSuccessBody = document.querySelector("#toastSuccessBody")
const toastWarning = new bootstrap.Toast(document.querySelector("#toastWarning"))
const toastWarningBody = document.querySelector("#toastWarningBody")
const toastDanger = new bootstrap.Toast(document.querySelector("#toastDanger"))
const toastDangerBody = document.querySelector("#toastDangerBody")
const newSessionButton = document.querySelector("#newSessionButton")

new DataTable("#sessions", {
    ajax: {
        url: url,
        type: "GET",
    },
    columns: [
        { data: "name" },
        {
            data: "number",
            render: function (data, type, row) {
                return `<a class="number" id="${row.id}">${data}</a>`
            },
        },
        { data: "url" },
        {
            data: "active",
            render: function (data, type, row) {
                return `<a class="active" id="active-${row.id}">${data === 1 ? "Sí" : "No"}</a>`
            },
        },
        { data: "created_at" },
    ],
    processing: true,
    serverSide: false,
})

const getSession = async (id) => {
    try {
        const data = await http.get(`${url}/${id}`)
        return data
    } catch (error) {
        console.error(error)
    }
}

const loadCourses = async (selectedCourseId = null) => {
    const courses = await http.get("http://localhost:5000/course")
    const courseSelect = document.querySelector("#courseID")
    courseSelect.innerHTML = ""
    courses.data.forEach((course) => {
        if (course.active) {
            const option = document.createElement("option")
            option.value = course.id
            option.textContent = course.name
            if (course.id === selectedCourseId) option.selected = true
            courseSelect.appendChild(option)
        }
    })
}

const openModal = async (mode, data) => {
    const sessionModalLabel = document.querySelector("#sessionModalLabel")
    sessionModalLabel.textContent = "Agregar sesión"
    form.reset()
    sessionModal.show()

    let selectedCourseId = null
    if (mode === "edit" && data) {
        sessionModalLabel.textContent = "Editar sesión"
        const number = document.querySelector("#number")
        const url = document.querySelector("#url")
        number.value = data.number
        url.value = data.url
        selectedCourseId = data.course_id
    }

    await loadCourses(selectedCourseId)
}

const reloadTable = () => {
    const dataTable = new DataTable("#sessions")
    dataTable.ajax.reload()
}

const updateSessionStatus = async (id) => {
    const response = await http.patch(`${url}/status/${id}`, { updatedBy: getUserID() })
    if (response.status === 200) {
        toastSuccessBody.innerHTML = "Sesion actualizada."
        toastSuccess.show()
        reloadTable()
        return
    } else {
        toastDangerBody.innerHTML = "Error al actualizar sesión."
        toastDanger.show()
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    if (mode === "edit") {
        data.updatedBy = getUserID()
        http.patch(`${url}/${id}`, data).then((response) => {
            if (response.status === 200) {
                toastSuccessBody.innerHTML = "Sesión actualizada."
                toastSuccess.show()
                reloadTable()
                sessionModal.hide()
                return
            } else {
                toastDangerBody.innerHTML = "Error al actualizar sesión."
                toastDanger.show()
            }
        })
        return
    }
    data.createdBy = getUserID()
    http.post(`${url}`, data).then((response) => {
        switch (response.status) {
            case 201:
                toastSuccessBody.innerHTML = "Sesión creada."
                toastSuccess.show()
                reloadTable()
                sessionModal.hide()
                break
            case 409:
                toastWarningBody.innerHTML = "El número de sesión para este curso ya existe."
                toastWarning.show()
                break
            case 400:
                toastWarningBody.innerHTML = "Este curso no puede tener más sesiones."
                toastWarning.show()
                break
            default:
                toastDangerBody.innerHTML = "Error al actualizar sesión."
                toastDanger.show()
        }
    })
})

tbody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("number")) {
        const sessionData = await getSession(e.target.id)
        mode = "edit"
        openModal(mode, sessionData.session)
        id = sessionData.session.id
        return
    }
    if (e.target.classList.contains("active")) {
        updateSessionStatus(e.target.id.split("-")[1])
    }
})

newSessionButton.addEventListener("click", () => {
    form.reset()
    mode = "add"
    openModal(mode)
})

getSessionData()
prepareEndSession()
