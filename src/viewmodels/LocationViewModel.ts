import LocationModel from "../models"

class LocationViewModel {

    location: LocationModel

    constructor(latitude: number, longitude: number) {
        this.location = new LocationModel(latitude, longitude, Date.now() / this.currentTimestamp())
    }

    public updateLocation(latitude: number, longitude: number): void {
        this.location.latitude = latitude
        this.location.longitude = longitude
        this.location.timestamp = this.currentTimestamp()
    }

    private currentTimestamp(): number {
        return Date.now()/1000
    }
}

export default LocationViewModel