import * as AppleAuthentication from "expo-apple-authentication";
import { UserModel } from "../models";

export class UserViewModel {
    
    public async login(): Promise<void> {
        try {
            const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
            });
            const userModel = new UserModel(credential.fullName.givenName, credential.email, credential.user)
            // TODO: verify with https://appleid.apple.com/auth/keys
            // signed in
        } catch (e) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
            // handle that the user canceled the sign-in flow
            } else {
            // handle other errors
            }
        }
    }
}