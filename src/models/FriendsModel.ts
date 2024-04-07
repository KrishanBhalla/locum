import * as SecureStore from 'expo-secure-store';
import { IFriend } from '../types';
import { CLIENT } from '../api/constants';

const LOCAL_FRIENDS_KEY = 'locum-friends-list'
const LOCAL_FRIEND_REQUEST_KEY = 'locum-friend-requests-list'

export class FriendsModel {


    public async clearFriends(): Promise<void> {
        await SecureStore.setItemAsync(LOCAL_FRIENDS_KEY, JSON.stringify([]));
      }

    public async saveFriendsLocally(friends: IFriend[]) {
        await SecureStore.setItemAsync(LOCAL_FRIENDS_KEY, JSON.stringify(friends));
      }
    
    public async saveFriendRequestsLocally(friendReqs: IFriend[]) {
    await SecureStore.setItemAsync(LOCAL_FRIEND_REQUEST_KEY, JSON.stringify(friendReqs));
    }

    public async getFriendsLocally(): Promise<IFriend[]> {
        let result = await SecureStore.getItemAsync(LOCAL_FRIENDS_KEY);
        if (result) {
            return JSON.parse(result)
        }
        return []
    }

    public async getFriendRequestsLocally(): Promise<IFriend[]> {
        let result = await SecureStore.getItemAsync(LOCAL_FRIEND_REQUEST_KEY);
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
        let friends = data.data.map(d => {return {name: d.fullName || "", userId: d.userId}})
        await this.saveFriendsLocally(friends)
        return friends
    }


    public async getFriendRequestsFromServer(): Promise<IFriend[]> {

        let data = await CLIENT.GET("/friends/requests", {})

        if (data.error !== undefined) {
            console.error("Error in getting friend requests");
            return []
        }
        let friendReqs = data.data.map(d => {return {name: d.fullName || "", userId: d.userId}})
        await this.saveFriendRequestsLocally(friendReqs)
        return friendReqs
    }


    public async updateFriendRequest(friendId: string, requestAccepted: boolean): Promise<void> {
        await CLIENT.POST("/friends/response", { body: {friendId: friendId, accept: requestAccepted}})
    }

    public async sendFriendRequest(friendId: string): Promise<void> {
        await CLIENT.POST("/friends/request", { body: {friendId: friendId}})
    }
}
