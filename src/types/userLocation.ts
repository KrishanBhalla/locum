import * as Location from 'expo-location';

export interface IUserLocation {
    userId: string,
    coords: Location.LocationObjectCoords
    timestamp: number
  }