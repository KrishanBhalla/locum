import React from 'react'
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, DarkTheme, BottomNavigation, Theme } from 'react-native-paper';
import { LoginScreen, MapScreen, UserScreen, FriendsScreen } from "./src/screens"
import { FollowersViewModel, FollowingViewModel, LocationViewModel, UserViewModel } from './src/viewmodels';
import { UserModel, FollowersModel, FollowingModel } from './src/models';


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
  const followersModel = new FollowersModel()
  const followingModel = new FollowingModel()
  // View models
  const locationViewModel = new LocationViewModel()
  const userViewModel = new UserViewModel(userModel)
  const followersViewModel = new FollowersViewModel(followersModel, userModel)
  const followingViewModel = new FollowingViewModel(followingModel, userModel)


  const [index, setIndex] = React.useState<number>(0);
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<Theme>(lightTheme)

  const routes = [
    { key: 'map', title: 'Map', icon: 'map' },
    { key: 'friends', title: 'Friends', icon: require('./assets/icons/shareLocation.png')},
    { key: 'user', title: isUserLoggedIn ? 'User' : 'Login', icon: isUserLoggedIn ? 'account' : 'account-search' }
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
    friends: () => <FriendsScreen followersViewModel={followersViewModel} followingViewModel={followingViewModel}/>,
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
