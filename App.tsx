import React from 'react'
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, DarkTheme, BottomNavigation, Theme } from 'react-native-paper';
import { LoginScreen, MapScreen, SettingsScreen, FriendsScreen } from "./src/screens"
import { FriendsViewModel, LocationViewModel, UserViewModel, FriendLocationViewModel } from './src/viewmodels';
import { UserModel, FriendsModel, FriendLocationModel, LocationModel } from './src/models';
import { Middleware } from 'openapi-fetch';
import { CLIENT } from './src/api/constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';


const lightTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8FAFF',
    accent: '#9EBAFF',
    primary: '#9efffa'
  },
}
const darkTheme = {
  ...DarkTheme,
  roundness: 2,
  colors: {
    ...DarkTheme.colors,
  },
}

const locationModel = new LocationModel({latitude: 0, longitude: 0, altitude: 0, altitudeAccuracy: 1, accuracy: 1, heading: 0, speed: 0} , 0)


export default function App() {
  // models
  const userModel = new UserModel()
  const friendsModel = new FriendsModel()
  const friendLocationModel = new FriendLocationModel()
  // View models
  const locationViewModel = new LocationViewModel(locationModel)
  const userViewModel = new UserViewModel(userModel)
  const friendsViewModel = new FriendsViewModel(friendsModel, userModel)
  const friendLocationsViewModel = new FriendLocationViewModel(friendsModel, userModel, friendLocationModel)

  const [index, setIndex] = React.useState<number>(0);
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<Theme>(lightTheme)

  React.useEffect(() => {
    const TokenMiddleware: Middleware = {
      async onRequest(req, _) {
      const token = await userModel.getTokenLocally()
      req.headers.set("Authorization", token);
      return req;
      },
    }
    CLIENT.use(TokenMiddleware)
  }, [isUserLoggedIn])

  // Request permissions for location
  React.useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync()
      if (foreground.granted) await Location.requestBackgroundPermissionsAsync()
    }
    requestPermissions()
  }, [])

  React.useEffect(() => {
    const TokenMiddleware: Middleware = {
      async onRequest(req, _) {
      const token = await userModel.getTokenLocally()
      req.headers.set("Authorization", token);
      return req;
      },
    }
    CLIENT.use(TokenMiddleware)
  }, [isUserLoggedIn])

  const routes = [
    { key: 'map', title: 'Map', icon: 'map' },
    { key: 'friends', title: 'Friends', icon: 'account-group-outline'},
    { key: 'user', title: isUserLoggedIn ? 'Settings' : 'Login', icon: isUserLoggedIn ? 'cog' : 'account-search' }
  ];

  const renderScene = BottomNavigation.SceneMap({
    user: () => {
        if (isUserLoggedIn) {
        return <SettingsScreen userViewModel={userViewModel} toggleTheme={() => {
        if (theme.dark) {
          setTheme(lightTheme)
        } else {
          setTheme(darkTheme)
        }
      }} setUserIsLoggedOut={() => setIsUserLoggedIn(false)} />
    }
    return <LoginScreen 
      userViewModel={userViewModel}
      setUserIsLoggedIn={() => {
        setIsUserLoggedIn(true)
        setIndex(0) // Go to map page
      }}
      />
    },
    map: () => <MapScreen locationViewModel={locationViewModel} friendLocationsViewModel={friendLocationsViewModel}/>,
    friends: () => <FriendsScreen userViewModel={userViewModel} friendsViewModel={friendsViewModel}/>,
  });


  React.useEffect(() => {
    const hasCredentialsCallback = async () => {
      setIsUserLoggedIn(true)
    }
    const errorCallback = async () => {
      setIndex(routes.length - 1)
      setIsUserLoggedIn(false)
    }
    userViewModel.getToken(hasCredentialsCallback, errorCallback)
  }, [index])


  return <PaperProvider theme={theme}>
    <BottomNavigation
      shifting={true}
      barStyle={styles.navbar}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  </PaperProvider>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixToText: {
    height: '10%',
    paddingStart: '10%',
    paddingEnd: '10%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navbar: {
    height: '8%',
  },
});


const LOCATION_TASK_NAME = "LOCUM-BACKGROUND-LOCATION"

interface BackgroundLocationUpdate {
  data: {
    locations: Location.LocationObject[]
  },
  error: any
}

const startBackgroundUpdate = async () => {
    // Don't track position if permission is not granted
    const { granted } = await Location.getBackgroundPermissionsAsync()
    if (!granted) {
        console.log("location tracking denied")
        return
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME)
    if (!isTaskDefined) {
        console.log("Task is not defined")
        return
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK_NAME
    )
    if (hasStarted) {
        console.log("Already started")
        return
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.Highest,
        // Make sure to enable this notification if you want to consistently track in the background
        showsBackgroundLocationIndicator: true,
        foregroundService: {
        notificationTitle: "Locum",
        notificationBody: "Locum is tracking location in the background",
        notificationColor: "#fff",
        },
    })
}

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data: { locations } , error }: BackgroundLocationUpdate) => {
if (error) {
    console.error(error)
    return
}
if (locations) {
    // Extract location coordinates from data
    const location = locations.pop()
    if (location) {
    locationModel.updateLocationOnServer(location.coords, location.timestamp)
    }
}
})

startBackgroundUpdate()