new Chart(document.getElementById("chartjs-bar"), {
    type: "bar",
    data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        datasets: [
            {
                label: "Año pasado",
                backgroundColor: window.theme.primary,
                borderColor: window.theme.primary,
                hoverBackgroundColor: window.theme.primary,
                hoverBorderColor: window.theme.primary,
                data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
                barPercentage: 0.75,
                categoryPercentage: 0.5,
            },
            {
                label: "Este año",
                backgroundColor: "#dee2e6",
                borderColor: "#dee2e6",
                hoverBackgroundColor: "#dee2e6",
                hoverBorderColor: "#dee2e6",
                data: [69, 66, 24, 48, 52, 51, 44, 53, 62, 79, 51, 68],
                barPercentage: 0.75,
                categoryPercentage: 0.5,
            },
        ],
    },
    options: {
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            yAxes: [
                {
                    gridLines: {
                        display: false,
                    },
                    stacked: false,
                    ticks: {
                        stepSize: 20,
                    },
                },
            ],
            xAxes: [
                {
                    stacked: false,
                    gridLines: {
                        color: "transparent",
                    },
                },
            ],
        },
    },
})
