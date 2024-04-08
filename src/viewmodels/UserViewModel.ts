import * as AppleAuthentication from "expo-apple-authentication";
import { UserModel } from "../models";
import { IFriend } from "../types";

export class UserViewModel {
    
    userModel: UserModel

    constructor(userModel: UserModel) {
        this.userModel = userModel
    }

    public async login(): Promise<void> {
        try {
            const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
            });
            const token = await this.userModel.login(credential.user, credential.fullName.givenName + " " + credential.fullName.familyName, credential.email)
            // TODO: verify with https://appleid.apple.com/auth/keys
            // signed in
            this.userModel.savePersistentTokenLocally(credential.user)
            this.userModel.saveTokenLocally(token)
            this.userModel.saveNameLocally(credential.fullName.givenName || credential.email || credential.user)
        } catch (e) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
            // handle that the user canceled the sign-in flow
            } else {
            // handle other errors
            }
        }
    }

    public async queryUsers(query: string, cb: UsersCallback): Promise<void> {
        let results = await this.userModel.searchForUserOnServer(query)
        cb(results)
    }

    public async logout(): Promise<void> {
        const token = await this.userModel.getTokenLocally()
        const persistentToken = await this.userModel.getPersistentTokenLocally()
        if (token) {
            this.userModel.clearTokenLocally()
        }
        if (persistentToken) {
            this.userModel.clearPersistentTokenLocally()
        }
    }

    public async rename(newName: string): Promise<void> {
        this.userModel.saveNameLocally(newName)
        await this.userModel.rename(newName)
    }
    
    // Locally check for auth token, and validate with Apple, else errorCallback should force a sign-in.
    public async getToken(hasCredentialsCallback: Callback, errorCallback: Callback) {
        let result = await this.userModel.getTokenLocally();
        let persistentToken = await this.userModel.getPersistentTokenLocally()
        if (result && persistentToken) {
            let authResult = await AppleAuthentication.getCredentialStateAsync(persistentToken)
            if (authResult === AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED) {
                // This should:
                // 1. Allow the user access to the app without delay
                // 2. login via the server
                hasCredentialsCallback(result)
                return
            }
        }
        // Force sign in with apple
        errorCallback(result);
      }

    public async getName(hasNameCallback: Callback, errorCallback: Callback): Promise<void> {
        let result = await this.userModel.getNameLocally();
        if (result) {
            hasNameCallback(result)
            return
        }
        errorCallback(result);
      }
}

type Callback = (result: string) => Promise<void>
type UsersCallback = (result: IFriend[]) => Promise<void>