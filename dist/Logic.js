class WeatherManager {
    constructor() {
        this.savedData = []
        this.unSavedData = []
        this.userId
    }
    setUserId(userId) {
        this.userId = userId
    }
    async getDataFromDB() {
        const cities = await $.get(`/cities/${this.userId}`)
        console.log(cities)
        this.savedData = cities
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
        this.unSavedData.forEach(c => {
            if (c.name === newObj.name)
            {
                cityAlreadyExist = true
            }
        })
        if (!cityAlreadyExist)
        {
            console.log(newObj)
            this.unSavedData.push(newObj)
        }
    }
    async saveCity(cityName) {
        const index = this.unSavedData.findIndex(c => c.name === cityName)
        const city = this.unSavedData[index]
        this.unSavedData.splice(index, 1)

        console.log(`LOGIC: save ${city.name}`)
        const user = await $.post(`/city/${this.userId}`, city)

        console.log(user)
        this.savedData = user.cities

    }
    async removeCity(cityName) {
        const city = this.savedData.find(c => c.name === cityName)
        city.saved = false
        const user = await $.ajax({
            url: `/city/${this.userId}/${cityName}`,
            method: "delete"
        })
        this.unSavedData.unshift(city)
        this.savedData = user.cities
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

