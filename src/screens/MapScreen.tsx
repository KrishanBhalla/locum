import React from 'react'
import MapView, { Circle, Region, Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native'
import { LocationViewModel } from '../viewmodels';
import * as Location from 'expo-location';
import { FAB, useTheme } from 'react-native-paper';

interface MapScreenProps {
  locationViewModel: LocationViewModel,
}

export const MapScreen = ({ locationViewModel }: MapScreenProps) => {

  const theme = useTheme();
  const [region, setRegion] = React.useState<Region>(locationViewModel.region)
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

  let latLng = { latitude: coords.latitude, longitude: coords.longitude }
  return (
    <MapView
      style={styles.map}
      region={region}
      userInterfaceStyle={theme.dark ? 'dark' : 'light'}
      ref={(ref) => mapRef = ref}
      onRegionChange={(r, _) => {
        locationViewModel.updateRegion(r)
      }}
      onRegionChangeComplete={(r, _) => {
        locationViewModel.updateRegion(r)
        setRegion(r)
      }}
    >
      <Circle center={latLng} radius={coords.accuracy} fillColor={markerBlue(0.1)} strokeColor={markerBlue(0.2)} />
      <Marker
        coordinate={latLng}
      >
        <View
          style={{
            width: MARKER_RADIUS * 2,
            height: MARKER_RADIUS * 2,
            backgroundColor: markerBlue(1),
            borderRadius: MARKER_RADIUS,
            borderColor: COLOR_WHITE,
            borderWidth: MARKER_RADIUS / 4
          }}
        />
      </Marker>
      <FAB
        style={styles.fab}
        icon={require('../../assets/mapMarkers/mapMarkerAccount.png')}
        onPress={() => {
          locationViewModel.resetRegion()
          mapRef.animateToRegion(locationViewModel.region, 1000)
        }}
      />
    </MapView >
  )
}

const MARKER_RADIUS = 10

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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  bottom: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
