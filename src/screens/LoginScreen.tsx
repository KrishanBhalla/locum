import * as AppleAuthentication from 'expo-apple-authentication';
import { View, StyleSheet } from 'react-native';
import React from 'react'
import { UserViewModel } from '../viewmodels';

interface LoginScreenProps {
    userViewModel: UserViewModel
    setUserIsLoggedIn: () => void
}

export const LoginScreen = ({userViewModel, setUserIsLoggedIn}: LoginScreenProps) => {
    return (
    <View style={styles.container}>
        <View style={styles.padding}/>
        <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={styles.button}
            onPress={async () => {
              await userViewModel.login()
              setUserIsLoggedIn()
            }}
        />
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padding: {
    flex: 1
  },
  button: {
    width: 200,
    height: 44,
    marginBottom: 100,
  },
});
