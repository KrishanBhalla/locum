import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import MapScreen from "./src/screens"
import * as Location from 'expo-location';
import LocationViewModel from './src/viewmodels';
import { Region } from 'react-native-maps';
import { Camera } from '@rnmapbox/maps';

let foregroundSubscription: {remove: () => void} | null = null

export default function App() {
  // state
  const [location, setLocation] = React.useState<LocationViewModel>();
  const [region, setRegion] = React.useState<Region>({latitude: 0, longitude: 0, latitudeDelta: 0.005, longitudeDelta: 0.005});
  const [errorMsg, setErrorMsg] = React.useState<string>();

  React.useEffect(() => {
     getUserLocation(setLocation, setErrorMsg, setRegion)
  }, [])

  // Invalid states
  if (errorMsg !== undefined) {
    return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>This app requires location permissions to function</Text>
      </View>
    </PaperProvider>
    )
  }
  if (location === undefined) {
    return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Awaiting Location</Text>
      </View>
    </PaperProvider>
    )
  }

  // Set up view models

  // setup views
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
      <MapScreen location={location.location} region={region} onRegionChange={setRegion}/>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '10%',
    height: 'auto',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


function getUserLocation(
  setLocation: React.Dispatch<React.SetStateAction<LocationViewModel>>,
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>,
  setRegion: React.Dispatch<React.SetStateAction<Region>>): void {

  const getRegion = async () =>  {
    const currentLocation = await Location.getCurrentPositionAsync({accuracy: Location.LocationAccuracy.Balanced, distanceInterval: 1})
    setRegion( {latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005})
  }

  const watchLocation = async () => Location.watchPositionAsync({accuracy: Location.LocationAccuracy.Balanced, distanceInterval: 1}, (currentLocation: Location.LocationObject) => {
    console.log(new Date().toString())
    console.log(currentLocation)
    setLocation(new LocationViewModel(currentLocation.coords.latitude, currentLocation.coords.longitude));
  })

  	// To get the user permission for the foreground location access and fetch the location
	const getUserLocation = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync()
        if(!foreground.granted) {
          setErrorMsg('Permission to access location was denied')
        }
    const { granted } = await Location.getForegroundPermissionsAsync()
    if(!granted) {
      setErrorMsg('Location tracking denied!')
      return
    }
    // Best practice to remove the subscription before fetching it to stop already running location fetching 
    foregroundSubscription?.remove()
    foregroundSubscription = await watchLocation()
  }
  getRegion()
  getUserLocation()
}
