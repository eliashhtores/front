let url = "http://localhost:5000/course"
let id = "",
    mode
// @@TODO Refactor to remove mode
const tbody = document.querySelector("tbody")
const form = document.querySelector("form")
const courseModal = new bootstrap.Modal(document.querySelector("#courseModal"))
const toastSuccess = new bootstrap.Toast(document.querySelector("#toastSuccess"))
const toastSuccessBody = document.querySelector("#toastSuccessBody")
const toastWarning = new bootstrap.Toast(document.querySelector("#toastWarning"))
const toastWarningBody = document.querySelector("#toastWarningBody")
const toastDanger = new bootstrap.Toast(document.querySelector("#toastDanger"))
const toastDangerBody = document.querySelector("#toastDangerBody")
const newCourseButton = document.querySelector("#newCourseButton")

new DataTable("#courses", {
    ajax: {
        url: url,
        type: "GET",
    },
    columns: [
        {
            data: "name",
            render: function (data, type, row) {
                return `<a class="name" id="${row.id}">${data}</a>`
            },
        },
        { data: "length" },
        { data: "price" },
        { data: "language" },
        { data: "available_at" },
        { data: "mark" },
        { data: "presenter" },
        { data: "presented_by" },
        { data: "attendance" },
        { data: "sessions" },
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
    scrollX: true,
})

const getCourse = async (id) => {
    try {
        const data = await http.get(`${url}/${id}`)
        return data
    } catch (error) {
        console.error(error)
    }
}

const openModal = (mode, data) => {
    const courseModalLabel = document.querySelector("#courseModalLabel")
    courseModalLabel.textContent = "Agregar curso"
    form.reset()
    courseModal.show()

    if (mode === "edit" && data) {
        courseModalLabel.textContent = "Editar curso"

        const name = document.querySelector("#name")
        const length = document.querySelector("#length")
        const price = document.querySelector("#price")
        const language = document.querySelector("#language")
        const availableAt = document.querySelector("#availableAt")
        const mark = document.querySelector("#mark")
        const presenter = document.querySelector("#presenter")
        const presentedBy = document.querySelector("#presentedBy")
        const attendance = document.querySelector("#attendance")
        const sessions = document.querySelector("#sessions")

        name.value = data.name
        length.value = data.length
        price.value = data.price
        language.value = data.language
        availableAt.value = data.available_at
        mark.value = data.mark
        presenter.value = data.presenter
        presentedBy.value = data.presented_by
        attendance.value = data.attendance
        sessions.value = data.sessions
    }
}

const reloadTable = () => {
    const dataTable = new DataTable("#courses")
    dataTable.ajax.reload()
}

const updateCourseStatus = async (id) => {
    const response = await http.patch(`${url}/status/${id}`, { updatedBy: getUserID() })
    if (response.status === 200) {
        toastSuccessBody.innerHTML = "Curso actualizado."
        toastSuccess.show()
        reloadTable()
        return
    } else {
        toastDangerBody.innerHTML = "Error al actualizar curso."
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
            courseModal.hide()
            if (response.status === 200) {
                toastSuccessBody.innerHTML = "Curso actualizado."
                toastSuccess.show()
                reloadTable()
                return
            } else {
                toastDangerBody.innerHTML = "Error al actualizar curso."
                toastDanger.show()
            }
        })
        return
    }
    data.createdBy = getUserID()
    http.post(`${url}`, data).then((response) => {
        switch (response.status) {
            case 201:
                toastSuccessBody.innerHTML = "Curso creado."
                toastSuccess.show()
                reloadTable()
                courseModal.hide()
                break
            case 409:
                toastWarningBody.innerHTML = "El curso ya existe."
                toastWarning.show()
                break
            default:
                toastDangerBody.innerHTML = "Error al actualizar el curso."
                toastDanger.show()
        }
    })
})

tbody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("name")) {
        const courseData = await getCourse(e.target.id)
        id = courseData.course.id
        mode = "edit"
        openModal(mode, courseData.course)
        return
    }
    if (e.target.classList.contains("active")) {
        updateCourseStatus(e.target.id.split("-")[1])
    }
})

newCourseButton.addEventListener("click", () => {
    form.reset()
    mode = "add"
    openModal(mode)
})

getSessionData()
prepareEndSession()
