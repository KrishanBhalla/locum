import * as SecureStore from 'expo-secure-store';

const LOCAL_TOKEN_KEY = 'locum-token'
const LOCAL_NAME_KEY = 'locum-full-name'

export class UserModel {

    public async login(persistentToken: string): Promise<void> {
        const response = await fetch("localhost:8080/login", {
            method: 'POST',
            body: JSON.stringify({token: persistentToken}),
            headers: {'Content-Type': 'application/json'} 
          });
          
          if (!response.ok) 
          { 
              console.error("Error");
          }
          else if (response.status >= 400) {
              console.error('HTTP Error: '+response.status+' - '+response.statusText);
          }
          // Success!
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
