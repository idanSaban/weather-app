const renderer = new Renderer()
const weatherManager = new WeatherManager()

const loadPage = async () => {
    if (localStorage.getItem("weatherUser") === null)
    {
        const user = await $.get('/user')
        localStorage.setItem("weatherUser", user)
        weatherManager.setUserId(user)
        console.log(user)

    } else
    {
        const user = localStorage.getItem("weatherUser")
        weatherManager.setUserId(user)
        await weatherManager.getDataFromDB()
        console.log(user)
    }
    renderer.renderData(weatherManager.cityData)
}

const handleSearch = async () => {
    const input = $("#input").val()
    await weatherManager.getCityData(input)
    renderer.renderData(weatherManager.cityData)
}
$("#search").on("click", handleSearch)

const saveCity = async function () {
    const cityName = $(this).closest(".box").data()
    console.log(`saving ${cityName.name}`)
    await weatherManager.saveCity(cityName.name)
    renderer.renderData(weatherManager.cityData)
}
const removeCity = async function () {
    const cityName = $(this).closest(".box").data()
    await weatherManager.removeCity(cityName.name)
    console.log(weatherManager.cityData)
    renderer.renderData(weatherManager.cityData)
}
const updateCity = function () {
    const cityName = $(this).closest(".box").data()
    weatherManager.updateCity(cityName.name)
}

$("#weather-container").on("click", ".save", saveCity)
$("#weather-container").on("click", ".unsave", removeCity)
$("#weather-container").on("click", ".fa-sync-alt", updateCity)

$("#input").keypress(function (e) {
    const key = e.which;
    if (key == 13)
    {
        $("#search").trigger("click")
    }
});

loadPage()