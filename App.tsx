import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { LoginScreen, MapScreen } from "./src/screens"
import { LocationViewModel, UserViewModel } from './src/viewmodels';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


export default function App() {
  // state
  const locationViewModel = new LocationViewModel()
  const userViewModel = new UserViewModel()
  React.useEffect(() => {
  }, [])



  // setup views
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Welcome'}}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <StatusBar style="auto" />
        </View>
        <LoginScreen userViewModel={userViewModel}/>
        <MapScreen locationViewModel={locationViewModel}/>
      </NavigationContainer>
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
