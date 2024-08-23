let server = "http://localhost:5000"
if (window.location.hostname !== "127.0.0.1") server = "https://back-gjd8.onrender.com"

const url = `${server}/user`
let id = "",
    mode
const tbody = document.querySelector("tbody")
const userForm = document.querySelector("#userForm")
const courses = document.querySelector("#courses")
const toastDangerBody = document.querySelector("#toastDangerBody")
const newUserButton = document.querySelector("#newUserButton")
const courseInput = document.querySelector("#courseInput")
const userModal = new bootstrap.Modal(document.querySelector("#userModal"))
const courseModal = new bootstrap.Modal(document.querySelector("#courseModal"))
const enrollModal = new bootstrap.Modal(document.querySelector("#enrollModal"))
const toastSuccess = new bootstrap.Toast(document.querySelector("#toastSuccess"))
const toastSuccessBody = document.querySelector("#toastSuccessBody")
const toastWarning = new bootstrap.Toast(document.querySelector("#toastWarning"))
const toastWarningBody = document.querySelector("#toastWarningBody")
const toastDanger = new bootstrap.Toast(document.querySelector("#toastDanger"))
let activeCourses = []

new DataTable("#users", {
    ajax: {
        url: url,
        type: "GET",
    },
    columns: [
        { data: "first_name" },
        { data: "last_name" },
        {
            data: "username",
            render: function (data, type, row) {
                return `<a class="username" id="${row.id}">${data}</a>`
            },
        },
        { data: "created_at" },
        {
            data: "registration_count",
            render: function (data, type, row) {
                if (data) return `<a class="registration" id="registration-${row.id}">Ver</a>`
                return ""
            },
        },
        {
            data: "registration_count",
            render: function (data, type, row) {
                if (row.active)
                    return `<i class="align-middle" data-feather="log-in"></i> <a class="enroll" id="enroll-${row.id}"> Inscribir</a>`
                return ""
            },
        },
        {
            data: "active",
            render: function (data, type, row) {
                return `<a class="active" id="active-${row.id}">${data === 1 ? "Sí" : "No"}</a>`
            },
        },
    ],
    processing: true,
    serverSide: false,
})

const getUser = async (id) => {
    try {
        const data = await http.get(`${url}/${id}`)
        return data
    } catch (error) {
        console.error(error)
    }
}

const openModal = (mode, data) => {
    const recordModalLabel = document.querySelector("#recordModalLabel")
    recordModalLabel.textContent = "Agregar usuario"
    userForm.reset()
    userModal.show()

    if (mode === "edit" && data) {
        recordModalLabel.textContent = "Editar usuario"
        const firstName = document.querySelector("#firstName")
        const lastName = document.querySelector("#lastName")
        const username = document.querySelector("#username")
        const password = document.querySelector("#password")
        firstName.value = data.first_name
        lastName.value = data.last_name
        username.value = data.username
        password.value = data.password
    }
}

const reloadTable = () => {
    const dataTable = new DataTable("#users")
    dataTable.ajax.reload()
}

const updateUserStatus = async (id) => {
    const response = await http.patch(`${url}/status/${id}`, { updatedBy: getUserID() })
    if (response.status === 200) {
        toastSuccessBody.innerHTML = "Usuario actualizado."
        toastSuccess.show()
        reloadTable()
        return
    }
    toastDangerBody.innerHTML = "Error al actualizar usuario."
    toastDanger.show()
}

const fillRegistrationData = (data) => {
    courses.innerHTML = ""
    data.forEach((course) => {
        let link = "X"
        if (course.active == "No") link = ""
        courses.innerHTML += `
                <div class="container text-center">
                    <div class="row">
                        <div class="col-sm-4">${course.name}</div>
                        <div class="col-sm-2">${course.time_spent}</div>
                        <div class="col-sm-2">${course.active}</div>
                        <div class="col-sm-2">${course.created_at}</div>
                        <div class="col-sm-2"><a class="unsubscribe text-danger fw-bold" id=unsubscribe-${course.id}>${link}</a></div>
                    </div>
                </div>
            `
    })
}

const getCourseHistory = async (userID) => {
    courseModal.show()
    try {
        const data = await http.get(`${server}/registration/user/${userID}`)
        fillRegistrationData(data)
    } catch (error) {
        console.error(error)
    }
}

const enrollUser = async (userID) => {
    courseInput.value = ""
    document.querySelector("#results").innerHTML = ""

    enrollModal.show()
    document.querySelector("#results").addEventListener("click", async (e) => {
        if (e.target.classList.contains("enrollButton")) {
            const url = `${server}/registration`

            const data = {
                userID,
                courseID: e.target.id.split("-")[1],
                createdBy: getUserID(),
            }

            enrollModal.hide()

            const response = await http.post(url, data)
            if (response.status === 201) {
                toastSuccessBody.innerHTML = "El usuario ha sido inscrito en el curso."
                toastSuccess.show()
                reloadTable()
                return
            } else if (response.status === 409) {
                toastWarningBody.innerHTML = "El usuario ya está inscrito en este curso."
                toastWarning.show()
                enrollModal.show()
                return
            }
            toastDangerBody.innerHTML = "Error al inscribir usuario."
            toastDanger.show()
        }
    })
}

const removeSubscription = async (subscriptionID) => {
    const url = `${server}/registration/status/${subscriptionID}`
    const data = {
        updatedBy: getUserID(),
    }
    const response = await http.patch(url, data)
    if (response.status === 200) {
        toastSuccessBody.innerHTML = "Baja exitosa."
        toastSuccess.show()
        courseModal.hide()
        return
    }
    toastDangerBody.innerHTML = "Error al dar de baja."
    toastDanger.show()
}

const getActiveCourses = async () => {
    try {
        const data = await http.get(`${server}/course`)
        return data
    } catch (error) {
        console.error(error)
    }
}

const startCourseRequest = async () => {
    activeCourses = await getActiveCourses()
}

userForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(userForm)
    const data = Object.fromEntries(formData)
    if (mode === "edit") {
        data.updatedBy = getUserID()
        http.patch(`${url}/${id}`, data).then((response) => {
            userModal.hide()
            if (response.status === 200) {
                toastSuccessBody.innerHTML = "Usuario actualizado."
                toastSuccess.show()
                reloadTable()
                return
            } else {
                toastDangerBody.innerHTML = "Error al actualizar usuario."
                toastDanger.show()
            }
        })
        return
    }
    data.createdBy = getUserID()
    http.post(`${url}`, data).then((response) => {
        switch (response.status) {
            case 201:
                toastSuccessBody.innerHTML = "Usuario creado."
                toastSuccess.show()
                reloadTable()
                userModal.hide()
                break
            case 409:
                toastWarningBody.innerHTML = "El usuario ya existe."
                toastWarning.show()
                break
            default:
                toastDangerBody.innerHTML = "Error al actualizar el usuario."
                toastDanger.show()
        }
    })
})

tbody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("username")) {
        const userData = await getUser(e.target.id)
        id = userData.user.id
        mode = "edit"
        openModal(mode, userData.user)
        return
    }
    if (e.target.classList.contains("active")) {
        updateUserStatus(e.target.id.split("-")[1])
        return
    }
    if (e.target.classList.contains("registration")) {
        getCourseHistory(e.target.id.split("-")[1])
        return
    }
    if (e.target.classList.contains("enroll")) {
        enrollUser(e.target.id.split("-")[1])
        return
    }
})

courses.addEventListener("click", async (e) => {
    e.preventDefault()
    if (e.target.classList.contains("unsubscribe")) {
        removeSubscription(e.target.id.split("-")[1])
        return
    }
})

courseInput.addEventListener("input", (e) => {
    let coursesArray = []
    let html = ""
    document.querySelector("#results").innerHTML = ""

    const courseDetails = activeCourses.data.map((course) => ({
        id: course.id,
        name: course.name,
        active: course.active,
    }))

    if (e.target.value) {
        coursesArray = courseDetails.filter((course) => {
            const name = course.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            return (
                (name.toLowerCase().includes(e.target.value) || course.name.toLowerCase().includes(e.target.value)) &&
                course.active
            )
        })
        coursesArray.map((course) => {
            return (html += `<div class="row my-1">
                <div class="col-sm-6 mt-2">${course.name}</div>
                <div class="courseElement col-sm-6 text-center">
                    <button type="button" class="btn btn-success enrollButton" id="registration-${course.id}">Inscribir en este curso</button>
                </div>
            </div>`)
        })
        document.querySelector("#results").innerHTML = html
    }
})

newUserButton.addEventListener("click", () => {
    userForm.reset()
    mode = "add"
    openModal(mode)
})

startCourseRequest()
getSessionData()
prepareEndSession()
