import { View, StyleSheet } from 'react-native';
import React from 'react'
import { UserViewModel } from '../viewmodels';
import { Avatar, Button, Title, useTheme } from 'react-native-paper';

interface UserScreenProps {
  userViewModel: UserViewModel,
  toggleTheme: () => void,
  setUserIsLoggedOut: () => void
}

export const UserScreen = ({ userViewModel, toggleTheme, setUserIsLoggedOut}: UserScreenProps) => {

  const { colors } = useTheme()
  const [userName, setUserName] = React.useState("")
  
  React.useEffect(() => {
    userViewModel.getName(async (name) => setUserName(name), async (name) => {setUserName("Oh hi, you person with the phone.")})
  }, [])

  return (
    <View style={styles.container}>
      <Avatar.Icon icon="account" style={styles.icon} />
      <Title>{userName}</Title>
        <Button icon="theme-light-dark" mode="outlined" onPress={() => toggleTheme()} style={styles.button} color={colors.accent}>Toggle Dark Mode</Button>
        <Button icon="account" mode="outlined" onPress={() => {
          userViewModel.logout()
          setUserIsLoggedOut()
        }} style={styles.button} color={colors.accent}>Logout</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    height: 100,
    width: 100,
  },
  container: {
    paddingTop: '20%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    marginTop: 5,
    width: '80%',
    alignItems: 'center',
  }
});
