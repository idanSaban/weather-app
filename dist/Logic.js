class WeatherManager {
    constructor(renderer) {
        this.renderer = renderer
        this.cityData = []
    }
    getDataFromDB() {
        const cities = $.get(`/cities`)
        cities.then((data) => {
            console.log(data)
            if (data)
            {
                this.cityData.push(...data)
            }
            this.renderer.renderData(this.cityData)
        })
    }
    async getCityData(cityName) {
        const result = await $.get(`/city/${cityName}`)
        console.log(result)
        const newObj = {
            name: result.location.name,
            temperature: result.current.temp_c,
            condition: result.current.condition.text,
            conditionPic: result.current.condition.icon,
            updatedAt: result.updatedAt,
            saved: false
        }
        let cityAlreadyExist = false
        this.cityData.forEach(c => {
            if (c.name === newObj.name)
            {
                cityAlreadyExist = true
            }
        })
        if (!cityAlreadyExist)
        {
            console.log(newObj)
            this.cityData.push(newObj)
            this.renderer.renderData(this.cityData)
        }
    }
    saveCity(cityName) {
        const city = this.cityData.find(c => c.name === cityName)
        console.log(`LOGIC: save ${city.name}`)
        $.post(`/city`, city, (newCity) => {
            this.cityData = this.cityData.filter(c => c.name !== newCity.name)
            this.cityData.unshift(newCity)
            this.renderer.renderData(this.cityData)
        })
    }
    async removeCity(cityName) {
        const unsavedCity = await $.ajax({
            url: `/city/${cityName}`,
            method: "delete",
            success: function (res) {
                return res
            }
        })
        this.cityData = this.cityData.filter(c => c.name !== unsavedCity.name)
        this.cityData.push(unsavedCity)
        this.renderer.renderData(this.cityData)
    }
    async updateCity(cityName) {
        const updatedCity = await $.ajax({
            url: `/city/${cityName}`,
            method: "put",
            success: function (res) {
                return res
            }
        })
        console.log(updatedCity)
        const index = this.cityData.findIndex(c => c.name === updatedCity.name)
        this.cityData[index] = updatedCity
        this.renderer.renderData(this.cityData)
    }
}