import React from 'react'
import MapView, { Circle, Region, Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native'
import { FriendLocationViewModel, LocationViewModel } from '../viewmodels';
import * as Location from 'expo-location';
import { FAB, useTheme, Colors, Avatar } from 'react-native-paper';
import { IUserLocation } from '../types';
import { FriendLocationModel } from '../models';

interface MapScreenProps {
  locationViewModel: LocationViewModel,
  friendLocationsViewModel: FriendLocationViewModel
}

export const MapScreen = ({ locationViewModel, friendLocationsViewModel }: MapScreenProps) => {

  const theme = useTheme();
  const [region, setRegion] = React.useState<Region>(locationViewModel.region)
  const [coords, setCoords] = React.useState<Location.LocationObjectCoords>(locationViewModel.location.coords)
  const [friendLocations, setFriendLocations] = React.useState<IUserLocation[]>([])

  // Setup refs and animated effects
  let mapRef: MapView = new MapView({})

  React.useEffect(() => {
    const init = async () => {
      await locationViewModel.initialize(setCoords)
      await friendLocationsViewModel.getFriendLocations((loc) => setFriendLocations(loc), (_) => null)
      setRegion(locationViewModel.region)
      friendLocationsViewModel.subscribeToFriendLocationUpdates((loc) => setFriendLocations(loc), (_) => null)
    }
    init()

  }, [])

  let latLng = { latitude: coords.latitude, longitude: coords.longitude }
  const mapMarker = (loc: IUserLocation, colour: string) => {
    return <Marker
    key={loc.userId}
    coordinate={{latitude: loc.coords.latitude, longitude: loc.coords.longitude }}
    >
        <View
          style={{
            width: MARKER_RADIUS * 2,
            height: MARKER_RADIUS * 2,
            backgroundColor: colour,
            borderRadius: MARKER_RADIUS,
            borderColor: COLOR_WHITE,
            borderWidth: MARKER_RADIUS / 4
          }}
        />
    </Marker>
    }


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
      {
        friendLocations.map(loc => mapMarker(loc, Colors.pink500))
      }
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
        >
      </View>
        
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
