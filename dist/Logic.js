class WeatherManager {
    constructor() {
        this.cityData = []
        this.userId
    }
    setUserId(userId) {
        this.userId = userId
    }
    async getDataFromDB() {
        const cities = await $.get(`/cities/${this.userId}`)
        console.log(cities)
        this.cityData = cities
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
        }
    }
    async saveCity(cityName) {
        const city = this.cityData.find(c => c.name === cityName)
        console.log(`LOGIC: save ${city.name}`)
        const user = await $.post(`/city/${this.userId}`, city)
        console.log(user)
        this.cityData = user.cities

    }
    async removeCity(cityName) {
        const user = await $.ajax({
            url: `/city/${this.userId}/${cityName}`,
            method: "delete"
        })
        this.cityData = user.cities
    }
    // async updateCity(cityName) {
    //     const updatedCity = await $.ajax({
    //         url: `/city/${cityName}`,
    //         method: "put",
    //         success: function (res) {
    //             return res
    //         }
    //     })
    //     console.log(updatedCity)
    //     const index = this.cityData.findIndex(c => c.name === updatedCity.name)
    //     this.cityData[index] = updatedCity
    // }
}