import { View, ViewStyle } from "react-native"
import * as Location from 'expo-location';
import { Circle, Marker } from "react-native-maps";

const MARKER_RADIUS = 10

const COLOR_WHITE = 'rgba(256,256,256,1)'

export function markerBlue(transparency: number): string {
  return `rgba(64, 128, 256, ${transparency})`
}

export function mapMarkerStyle(colour: string): ViewStyle {
    return {
        width: MARKER_RADIUS * 2,
        height: MARKER_RADIUS * 2,
        backgroundColor: colour,
        borderRadius: MARKER_RADIUS,
        borderColor: COLOR_WHITE,
        borderWidth: MARKER_RADIUS / 4
      }
}

export function mapMarkerBackgroundCircle(coords: Location.LocationObjectCoords): React.JSX.Element {
    return <Circle
        center={{ latitude: coords.latitude, longitude: coords.longitude }}
        radius={coords.accuracy} fillColor={markerBlue(0.1)}
        strokeColor={markerBlue(0.1)} 
        />
}

export function mapMarker(coords: Location.LocationObjectCoords): React.JSX.Element {
    return <Marker coordinate={{ latitude: coords.latitude, longitude: coords.longitude }} >
      <View style={mapMarkerStyle(markerBlue(1))}/>
    </Marker>
}