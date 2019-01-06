class WeatherManager {
    constructor() {
        this.savedData = []
        this.unSavedData = []
        this.userId
    }
    setUserId(userId) {
        this.userId = userId
    }
    getDataToRender() {
        return this.savedData.concat(this.unSavedData)
    }
    async getDataFromDB() {
        const cities = await $.get(`/cities/${this.userId}`)
        this.savedData = cities
    }

    async getCityData(cityName) {
        const result = await $.get(`/city/${cityName}`)
        if (!result)
        {
            return
        }
        const newObj = {
            name: result.name,
            temperature: result.temperature,
            condition: result.condition,
            conditionPic: result.conditionPic,
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
            this.unSavedData.push(newObj)
        }
    }
    async saveCity(cityName) {
        const index = this.unSavedData.findIndex(c => c.name === cityName)
        const city = this.unSavedData[index]
        this.unSavedData.splice(index, 1)
        const user = await $.post(`/city/${this.userId}`, city)
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
}

