const renderer = new Renderer()
const weatherManager = new WeatherManager()
const savedData = weatherManager.savedData
const unSavedData = weatherManager.unSavedData

const loadPage = async () => {
    if (localStorage.getItem("weatherUser") === null)
    {
        const user = await $.get('/user')
        localStorage.setItem("weatherUser", user._id)
        weatherManager.setUserId(user._id)
    } else
    {
        const user = localStorage.getItem("weatherUser")
        weatherManager.setUserId(user)
        await weatherManager.getDataFromDB()
    }
    renderer.renderData(weatherManager.getDataToRender())
}

const handleSearch = async () => {
    const input = $("#input").val()
    if (!input)
    {
        return
    }
    await weatherManager.getCityData(input)
    renderer.renderData(weatherManager.getDataToRender())
}
$("#search").on("click", handleSearch)

const saveCity = async function () {
    const cityName = $(this).closest(".box").data()
    await weatherManager.saveCity(cityName.name)
    renderer.renderData(weatherManager.getDataToRender())
}
const removeCity = async function () {
    const cityName = $(this).closest(".box").data()
    await weatherManager.removeCity(cityName.name)
    renderer.renderData(weatherManager.getDataToRender())
}

$("#weather-container").on("click", ".save", saveCity)
$("#weather-container").on("click", ".unsave", removeCity)

$("#input").keypress(function (e) {
    const key = e.which;
    if (key == 13)
    {
        $("#search").trigger("click")
    }
});

loadPage()