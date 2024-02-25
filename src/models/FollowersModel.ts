import * as SecureStore from 'expo-secure-store';
import { IFriend } from '../types';
import { CLIENT } from '../api/constants';

const LOCAL_FOLLOWERS_KEY = 'locum-followers-list'

export class FollowersModel {


    public async clearFollowers(): Promise<void> {
        await SecureStore.setItemAsync(LOCAL_FOLLOWERS_KEY, JSON.stringify([]));
      }

    public async saveFollowersLocally(friends: IFriend[]) {
        await SecureStore.setItemAsync(LOCAL_FOLLOWERS_KEY, JSON.stringify(friends));
      }
      
    public async getFollowersLocally(): Promise<IFriend[]> {
        let result = await SecureStore.getItemAsync(LOCAL_FOLLOWERS_KEY);
        if (result) {
            return JSON.parse(result)
        }
        return []
    }

    public async getFollowersFromServer(userId): Promise<IFriend[]> {

        let data = await CLIENT.POST("/followers", { body: { userId : userId}})

        if (data.error !== undefined) {
            console.error("Error in getting followers");
            return []
        }
        return data.data.map(d => {return {name: d.fullName || "", userId: d.userId}})
    }
}
