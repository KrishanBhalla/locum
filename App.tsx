import React from 'react'
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, DarkTheme, BottomNavigation, Theme } from 'react-native-paper';
import { LoginScreen, MapScreen, UserScreen, FriendsScreen } from "./src/screens"
import { FriendsViewModel, LocationViewModel, UserViewModel } from './src/viewmodels';
import { UserModel, FriendsModel } from './src/models';
import { Middleware } from 'openapi-fetch';
import { CLIENT } from './src/api/constants';


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

export default function App() {
  // models
  const userModel = new UserModel()
  const friendsModel = new FriendsModel()
  // View models
  const locationViewModel = new LocationViewModel()
  const userViewModel = new UserViewModel(userModel)
  const friendsViewModel = new FriendsViewModel(friendsModel, userModel)

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

  const routes = [
    { key: 'map', title: 'Map', icon: 'map' },
    { key: 'friends', title: 'Friends', icon: 'account-group-outline'},
    { key: 'user', title: isUserLoggedIn ? 'User' : 'Login', icon: isUserLoggedIn ? 'account-cog' : 'account-search' }
  ];

  const renderScene = BottomNavigation.SceneMap({
    user: () => {
        if (isUserLoggedIn) {
        return <UserScreen userViewModel={userViewModel} toggleTheme={() => {
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
    map: () => <MapScreen locationViewModel={locationViewModel} />,
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
