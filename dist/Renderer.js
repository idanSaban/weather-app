class Renderer {
    constructor() {

    }
    renderData(allCityData) {
        $('#input').val("")
        $('#weather-container').empty()
        const source = $('#weather-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({ allCityData });
        $('#weather-container').append(newHTML);
    }
} 