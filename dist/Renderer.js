class Renderer {
    constructor() {

    }
    renderData(saved, unsaved) {
        const allCityData = saved.concat(unsaved)
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