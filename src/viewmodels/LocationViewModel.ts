import { LocationModel } from "../models"
import * as Location from 'expo-location';
import { LatLng, Region } from 'react-native-maps';

const DEFAULT_LOCATION_OPTS: Location.LocationOptions = {accuracy: Location.LocationAccuracy.Highest, distanceInterval: 10}
const FAST_LOCATION_OPTS: Location.LocationOptions = {accuracy: Location.LocationAccuracy.Balanced, distanceInterval: 10}

export class LocationViewModel {

    location: LocationModel
    foregroundSubscription: {remove: () => void} | null
    locationOpts: Location.LocationOptions
    errorMsg: string
    canGetLocation: boolean = false

    reqMillisToForceLocationUpdate = 30_000

    region: Region

    constructor(locationModel, locationOpts: Location.LocationOptions = DEFAULT_LOCATION_OPTS) {
        this.location = locationModel
        this.setInitialRegion()
        this.locationOpts = locationOpts
    }

    public async initialize(setCoords: React.Dispatch<React.SetStateAction<LatLng>>): Promise<void> {
        await this.getUserLocationPermissions()
        await this.setInitialLocation()
        this.setInitialRegion()
        await this.subscribeToLocationUpdates(setCoords)
    }

    public async updateLocation(coords: Location.LocationObjectCoords): Promise<void> {
        const timestamp = this.currentTimestamp()
        const timeSinceUpdate = (timestamp - this.location.timestamp)
        if ( timeSinceUpdate >  this.reqMillisToForceLocationUpdate ) {
            this.location.coords = coords
            this.location.timestamp = timestamp
            this.location.updateLocationOnServer(coords, timestamp)
        }
    }


    public updateRegion(r: Region): void {
        this.region = r
    }

    public updateRegionCentre(latitude: number, longitude: number): void {
        this.region = {latitude: latitude, longitude: longitude, latitudeDelta: this.region.latitudeDelta, longitudeDelta: this.region.longitudeDelta}
    }

    public resetRegion(): void {
        this.region = {latitude: this.location.coords.latitude, longitude: this.location.coords.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005}
    }


    private currentTimestamp(): number {
        return Date.now()
    }

    private async getUserLocationPermissions(): Promise<void> {

        const granted = await Location.getForegroundPermissionsAsync()
        if(!granted) {
            this.errorMsg = 'Location tracking denied!'
            return
        }
        this.canGetLocation = true
    }

    private async setInitialLocation(): Promise<void> {
        if (!this.canGetLocation) {
            return
        } 
        const currentLocation = await Location.getCurrentPositionAsync(FAST_LOCATION_OPTS)
        this.location = new LocationModel(currentLocation.coords, this.currentTimestamp())
    }

    private setInitialRegion(): void {

        this.region = {latitude: this.location.coords.latitude, longitude: this.location.coords.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005}
    }

    private async subscribeToLocationUpdates(setCoords: React.Dispatch<React.SetStateAction<Location.LocationObjectCoords>>): Promise<void> {
        
        if (!this.canGetLocation) {
            return
        }
        
        const watchLocation = () => Location.watchPositionAsync(this.locationOpts, (currentLocation) => {
            this.updateLocation(currentLocation.coords);
            setCoords(currentLocation.coords)
        })
    
            // To get the user permission for the foreground location access and fetch the location
        const getUserLocation = async () => {
            // Best practice to remove the subscription before fetching it to stop already running location fetching 
            this.foregroundSubscription?.remove()
            this.foregroundSubscription = await watchLocation()
        }
        getUserLocation()
        }
}