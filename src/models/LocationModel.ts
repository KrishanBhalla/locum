
class LocationModel {

    latitude: number
    longitude: number
    timestamp: number

    constructor(latitude: number, longitude: number, timestamp: number) {
        this.validateInputs(latitude, longitude, timestamp)
        this.latitude = latitude
        this.longitude = longitude
        this.timestamp = timestamp
    }

    private validateInputs(latitude: number, longitude: number, timestamp: number): void  {
    }
}

export default LocationModel