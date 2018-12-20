const renderer = new Renderer
const weatherManager = new WeatherManager(renderer)

const loadPage = () => {
    weatherManager.getDataFromDB()

}

const handleSearch = () => {
    const input = $("#input").val()
    weatherManager.getCityData(input)
}
$("#search").on("click", handleSearch)

const saveCity = function () {
    const cityName = $(this).closest(".box").data()
    console.log(`saving ${cityName.name}`)
    weatherManager.saveCity(cityName.name)
}
const removeCity = function () {
    const cityName = $(this).closest(".box").data()
    weatherManager.removeCity(cityName.name)
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