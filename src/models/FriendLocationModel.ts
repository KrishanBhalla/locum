

import * as Location from 'expo-location';
import { CLIENT } from "../api/constants"
import { IFriend, IUserLocation } from '../types';


export class FriendLocationModel {

    public async getLatestLocations(friends: IFriend[]): Promise<IUserLocation[]> {

        let data = await CLIENT.GET("/friends/locations", {})

        if (data.error !== undefined) {
            console.error("Error in getting followers");
            return []
        }
        let locations: IUserLocation[] = data.data.map(d => {
            return {
                userId: d.userId,
                timestamp: d.timestamp,
                coords: {
                    latitude: d.latitude,
                    longitude: d.longitude,
                    altitude: null,
                    accuracy: null,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null
                    }
                }
            })
        return locations
    }
}
