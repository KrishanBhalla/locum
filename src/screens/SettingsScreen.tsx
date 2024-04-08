import { View, StyleSheet } from 'react-native';
import React from 'react'
import { UserViewModel } from '../viewmodels';
import { Avatar, Button, IconButton, Title, useTheme, TextInput, Colors } from 'react-native-paper';

interface SettingsScreenProps {
  userViewModel: UserViewModel,
  toggleTheme: () => void,
  setUserIsLoggedOut: () => void
}

export const SettingsScreen = ({ userViewModel, toggleTheme, setUserIsLoggedOut}: SettingsScreenProps) => {

  const { colors } = useTheme()
  const [userName, setUserName] = React.useState("")
  const [isEditing, setIsEditing] = React.useState(false)

  const updateUserName = () => userViewModel.getName(async (name) => setUserName(name), async (name) => {setUserName("Oh hi, you person with the phone.")})
  
  React.useEffect(() => {
    updateUserName()
  }, [])

  

  const titleView = 
    <View style={styles.rowContainer}>
      <Title style={styles.userNameTitle}>{userName}</Title>
      <IconButton icon="pencil" style={styles.iconButton} color={colors.accent} onPress={()=>setIsEditing(true)} />
    </View>
    
  const editTitleView = 
    <View style={styles.rowContainer}>
      <TextInput style={styles.userNameTitle} value={userName} mode='flat' onChangeText={
        text => setUserName(text)
      }/>
      <IconButton icon="check" style={styles.iconButton} color={Colors.green500} onPress={
        ()=>{
          setIsEditing(false)
          userViewModel.rename(userName)
        }
        } />
      <IconButton icon="close" style={styles.iconButton} color={Colors.red500} onPress={()=>setIsEditing(false)} />
    </View>

  const titleOrEditView = () => {
    if (!isEditing) {
      return titleView
    }
    return editTitleView
  }

  return (
    <View style={styles.container}>
      <Avatar.Icon icon="account" style={styles.icon} />
      {titleOrEditView()}
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
  },
  rowContainer: {
    marginLeft: '5%',
    marginRight: '5%',
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  userNameTitle: {
    width: '70%',
    textAlign: 'left',
    fontSize: 20,
    overflow: 'hidden'
  },
  iconButton: {
    alignSelf: 'center'
  },
});
