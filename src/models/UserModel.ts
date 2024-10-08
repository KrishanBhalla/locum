import * as SecureStore from 'expo-secure-store';
import { CLIENT } from "../api/constants"
import { IFriend, ITheme } from '../types';


const LOCAL_TOKEN_KEY = 'locum-token'
const LOCAL_PERSISTENT_TOKEN_KEY = 'locum-persistent-token'
const LOCAL_NAME_KEY = 'locum-full-name'
const LOCAL_THEME_KEY = 'locum-theme'


export class UserModel {

    public async login(persistentToken: string, fullName: string, email: string): Promise<string> {
        const data  = await CLIENT.POST("/login", {body: {userId: persistentToken, fullName: fullName, email: email}});
  
        if (data.error !== undefined) { 
            console.error("Error in login");
        }

        const token = data.data.token
        return token
    }

    public async rename(newName: string): Promise<void> {
        const data = await CLIENT.POST("/me/rename", {body: {newName: newName}});
  
        if (data.error !== undefined) { 
            console.error("Error in rename");
        }
    }

    public async searchForUserOnServer(query: string): Promise<IFriend[]> {

        console.log("Query:",  query)
        const data = await CLIENT.POST("/users", {body: {queryString: query}})
        if (data.error !== undefined) 
        {   
            console.error("Error in finding users", data.error);
            return []
        }
        return data.data.map(d => {return {name: d.fullName || "", userId: d.userId}}).sort((a, b) => (a.name < b.name) ? -1 : 1)
    
    }

    public async savePersistentTokenLocally(token: string) {
        await SecureStore.setItemAsync(LOCAL_PERSISTENT_TOKEN_KEY, token);
      }

    public async getPersistentTokenLocally(): Promise<string> {
        return SecureStore.getItemAsync(LOCAL_PERSISTENT_TOKEN_KEY);
    }

    public async clearPersistentTokenLocally(): Promise<void> {
        SecureStore.deleteItemAsync(LOCAL_PERSISTENT_TOKEN_KEY);
    }

    
    public async saveTokenLocally(token: string) {
        await SecureStore.setItemAsync(LOCAL_TOKEN_KEY, token);
      }
      
    public async getTokenLocally(): Promise<string> {
        return SecureStore.getItemAsync(LOCAL_TOKEN_KEY);
    }

    public async clearTokenLocally(): Promise<void> {
        SecureStore.deleteItemAsync(LOCAL_TOKEN_KEY);
    }

    public async saveNameLocally(fullName: string) {
        await SecureStore.setItemAsync(LOCAL_NAME_KEY, fullName);
      }
      
    public async getNameLocally(): Promise<string> {
        return SecureStore.getItemAsync(LOCAL_NAME_KEY);
    }

    public async saveThemeLocally(theme: ITheme) {
        await SecureStore.setItemAsync(LOCAL_THEME_KEY, theme);
      }
      
    public async getThemeLocally(): Promise<ITheme> {
        const theme = await SecureStore.getItemAsync(LOCAL_THEME_KEY)
        if (theme) {
            return theme as ITheme;
        }
        return "light"
    }
}
