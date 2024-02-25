

import * as Location from 'expo-location';
import { CLIENT } from "../api/constants"


export class LocationModel {

    coords: Location.LocationObjectCoords
    timestamp: number

    constructor(coords: Location.LocationObjectCoords, timestamp: number) {
        this.coords = coords
        this.timestamp = timestamp
    }
}
