const stripe = Stripe("pk_test_wk6O7Cc5k3McBIG2Hut2irGs")

const items = [{ id: "xl-tshirt", amount: 1000 }]

let elements

initialize()
checkStatus()

document.querySelector("#payment-form").addEventListener("submit", handleSubmit)

async function initialize() {
    let server = "http://127.0.0.1:5000"
    if (window.location.hostname !== "localhost") server = "https://back-gjd8.onrender.com"
    const response = await fetch(`${server}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
    })
    const { clientSecret } = await response.json()

    const appearance = {
        theme: "stripe",
    }
    elements = stripe.elements({ appearance, clientSecret })

    const paymentElementOptions = {
        layout: "tabs",
    }

    const paymentElement = elements.create("payment", paymentElementOptions)
    paymentElement.mount("#payment-element")
}

async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    let server = "http://127.0.0.1:5500"
    if (window.location.hostname !== "localhost") server = "https://festodiplomados.netlify.app"
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: `${server}/success.html`,
        },
    })

    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message)
    } else {
        showMessage("Ocurrió un error inesperado.")
    }

    setLoading(false)
}

async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret")

    if (!clientSecret) {
        return
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)

    switch (paymentIntent.status) {
        case "succeeded":
            showMessage("Pago completado!")
            break
        case "processing":
            showMessage("Su pago se está procesando.")
            break
        case "requires_payment_method":
            showMessage("Su pago no fue exitoso, por favor intente nuevamente.")
            break
        default:
            showMessage("Algo salió mal.")
            break
    }
}

// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message")

    messageContainer.classList.remove("hidden")
    messageContainer.textContent = messageText

    setTimeout(function () {
        messageContainer.classList.add("hidden")
        messageContainer.textContent = ""
    }, 4000)
}

function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true
        document.querySelector("#spinner").classList.remove("hidden")
        document.querySelector("#button-text").classList.add("hidden")
    } else {
        document.querySelector("#submit").disabled = false
        document.querySelector("#spinner").classList.add("hidden")
        document.querySelector("#button-text").classList.remove("hidden")
    }
}
