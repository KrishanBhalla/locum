

import * as Location from 'expo-location';

export class LocationModel {

    coords: Location.LocationObjectCoords
    timestamp: number

    constructor(coords: Location.LocationObjectCoords, timestamp: number) {
        this.coords = coords
        this.timestamp = timestamp
    }

}
