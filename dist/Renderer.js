class Renderer {
    constructor() {

    }
    renderData(allCityData) {
        console.log("rendering")
        console.log(allCityData)
        $('#input').val("")
        $('#weather-container').empty()
        console.log({ allCityData })
        const source = $('#weather-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({ allCityData });
        $('#weather-container').append(newHTML);

    }
} 