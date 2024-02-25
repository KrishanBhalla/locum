import * as SecureStore from 'expo-secure-store';
import { CLIENT } from "../api/constants"
import { IFriend } from '../types';


const LOCAL_TOKEN_KEY = 'locum-token'
const LOCAL_NAME_KEY = 'locum-full-name'


export class UserModel {

    public async login(persistentToken: string, fullName: string, email: string): Promise<void> {
        const data  = await CLIENT.POST("/login", {body: {userId: persistentToken, fullName: fullName, email: email}});
  
        if (data.error !== undefined) 
        { 
            console.error("Error in login");
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

    public async saveTokenLocally(persistentToken: string) {
        await SecureStore.setItemAsync(LOCAL_TOKEN_KEY, persistentToken);
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
}
