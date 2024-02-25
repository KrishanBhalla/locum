import * as SecureStore from 'expo-secure-store';
import { IFriend } from '../types';
import { CLIENT } from "../api/constants"

const LOCAL_FOLLOWING_KEY = 'locum-followers-list'

export class FollowingModel {

    public async clearFollowing() {
        await SecureStore.setItemAsync(LOCAL_FOLLOWING_KEY, JSON.stringify([]));
    }


    public async saveFollowingLocally(friends: IFriend[]) {
        await SecureStore.setItemAsync(LOCAL_FOLLOWING_KEY, JSON.stringify(friends));
      }
      
    public async getFollowingLocally(): Promise<IFriend[]> {
        let result = await SecureStore.getItemAsync(LOCAL_FOLLOWING_KEY);
        if (result) {
            return JSON.parse(result)
        }
        return []
    }

    public async getFollowingFromServer(userId): Promise<IFriend[]> {

        let data = await CLIENT.POST("/following", { body: { userId : userId}})

        if (data.error !== undefined) {
            console.error("Error in getting following");
            return []
        }
        return data.data.map(d => {return {name: d.fullName || "", userId: d.userId}})
    }
}
