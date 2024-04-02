import * as SecureStore from 'expo-secure-store';
import { IFriend } from '../types';
import { CLIENT } from '../api/constants';

const LOCAL_FRIENDS_KEY = 'locum-friends-list'

export class FriendsModel {


    public async clearFriends(): Promise<void> {
        await SecureStore.setItemAsync(LOCAL_FRIENDS_KEY, JSON.stringify([]));
      }

    public async saveFriendsLocally(friends: IFriend[]) {
        await SecureStore.setItemAsync(LOCAL_FRIENDS_KEY, JSON.stringify(friends));
      }
      
    public async getFriendsLocally(): Promise<IFriend[]> {
        let result = await SecureStore.getItemAsync(LOCAL_FRIENDS_KEY);
        if (result) {
            return JSON.parse(result)
        }
        return []
    }

    public async getFriendsFromServer(): Promise<IFriend[]> {

        let data = await CLIENT.GET("/friends", {})

        if (data.error !== undefined) {
            console.error("Error in getting followers");
            return []
        }
        let followers = data.data.map(d => {return {name: d.fullName || "", userId: d.userId}})
        await this.saveFriendsLocally(followers)
        return followers
    }


    public async getFriendRequestsFromServer(): Promise<IFriend[]> {

        let data = await CLIENT.GET("/friends/requests", {})

        if (data.error !== undefined) {
            console.error("Error in getting friend requests");
            return []
        }
        return data.data.map(d => {return {name: d.fullName || "", userId: d.userId}})
    }


    public async updateFriendRequest(friendId: string, requestAccepted: boolean): Promise<void> {
        await CLIENT.POST("/friends/response", { body: {friendId: friendId, accept: requestAccepted}})
    }

    public async sendFriendRequest(friendId: string): Promise<void> {
        await CLIENT.POST("/friends/request", { body: {friendId: friendId}})
    }
}
