import React from 'react'
import MapView, { Circle, Region, Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native'
import { FriendLocationViewModel, LocationViewModel } from '../viewmodels';
import * as Location from 'expo-location';
import { FAB, useTheme, Colors } from 'react-native-paper';
import { IUserLocation } from '../types';
import * as mapFunctions from './mapFunctions';

interface MapScreenProps {
  locationViewModel: LocationViewModel,
  friendLocationViewModel: FriendLocationViewModel
}

export const MapScreen = ({ locationViewModel, friendLocationViewModel }: MapScreenProps) => {

  const theme = useTheme();
  const [region, setRegion] = React.useState<Region>(locationViewModel.region)
  const [coords, setCoords] = React.useState<Location.LocationObjectCoords>(locationViewModel.location.coords)
  const [friendLocations, setFriendLocations] = React.useState<IUserLocation[]>([])

  // Setup refs and animated effects
  let mapRef: MapView = new MapView({})

  React.useEffect(() => {
    const init = async () => {
      await locationViewModel.initialize(setCoords)
      await friendLocationViewModel.getFriendLocations((loc) => setFriendLocations(loc), (_) => null)
      setRegion(locationViewModel.region)
      friendLocationViewModel.subscribeToFriendLocationUpdates((loc) => setFriendLocations(loc), (_) => null)
    }
    init()

  }, [])

  const friendMapMarker = (loc: IUserLocation, colour: string) => {
    return <Marker
    key={loc.userId}
    coordinate={{latitude: loc.coords.latitude, longitude: loc.coords.longitude }}
    >
        <View
          style={mapFunctions.mapMarkerStyle(colour)}
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
      
      { // Show your friends
        friendLocations.map(loc => friendMapMarker(loc, Colors.pink500))
      }
      {mapFunctions.mapMarkerBackgroundCircle(coords)}
      {mapFunctions.mapMarker(coords)}
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
