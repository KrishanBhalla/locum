import React from 'react'
import MapView, { Circle, Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native'
import LocationViewModel from '../viewmodels';
import * as Location from 'expo-location';

interface MapScreenProps {
    locationViewModel: LocationViewModel
}

const MapScreen = ({locationViewModel} : MapScreenProps) => {

    const [region, setRegion] = React.useState<Region>(locationViewModel.region)
    const [markerRadius, setMarkerRadius] = React.useState(1)
    const [coords, setCoords] = React.useState<Location.LocationObjectCoords>(locationViewModel.location.coords)

    // Setup refs and animated effects
    let mapRef: MapView = new MapView({})

    React.useEffect(() => {
      const init = async () => {
        await locationViewModel.initialize(setCoords)
        setRegion(locationViewModel.region)
      }
      init()

      }, [])

    React.useEffect(() => {
      const getMarkerRadius = async () => {
        let c = await mapRef.getCamera();
        if (c.zoom !== undefined) {
          setMarkerRadius(Math.max(c.zoom!, 0.5))
        } else {
          setMarkerRadius(Math.max(c.altitude! / 200, 0.5))
        }
      }
      getMarkerRadius()
    }, [mapRef]) // used as a proxy for camera

    let latLng = {latitude: coords.latitude, longitude: coords.longitude}
    return (
        <View style={styles.container}>
            <MapView 
              style={styles.map}
              region={region}
              ref={(ref) => mapRef = ref}
              onRegionChangeComplete={(r, _) => {
                locationViewModel.updateRegion(r)
                setRegion(r)
              }}
              onLongPress={(_) => {
                locationViewModel.resetRegion()
                setRegion(locationViewModel.region)
              }}
            >
            <Circle center={latLng} radius={coords.accuracy} fillColor={markerBlue(0.1)} strokeColor={markerBlue(1)}/>
            <Circle center={latLng} radius={markerRadius * 1.3} fillColor={COLOR_WHITE}/>
            <Circle center={latLng} radius={markerRadius} fillColor={markerBlue(1)}/>
            <Circle center={latLng} radius={markerRadius} fillColor={markerBlue(1)}/>
         </MapView>
        </View>
    )
}


const COLOR_WHITE = 'rgba(256,256,256,1)'
function markerBlue(transparency: number): string {
  return `rgba(64, 128, 256, ${transparency})`
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });

export default MapScreen