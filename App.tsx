import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { MapScreen } from "./src/screens"
import { LocationViewModel } from './src/viewmodels';


export default function App() {
  // state
  const locationViewModel = new LocationViewModel()
  React.useEffect(() => {
  }, [])


  // Set up view models


  // // Invalid states
  // if (!locationViewModel.canGetLocation) {
  //   return (
  //   <PaperProvider>
  //     <View style={styles.container}>
  //       <Text>This app requires location permissions to function</Text>
  //       <Text>{locationViewModel.errorMsg || "No message"}</Text>
  //     </View>
  //   </PaperProvider>
  //   )
  // }
  // setup views
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
      <MapScreen locationViewModel={locationViewModel}/>
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
