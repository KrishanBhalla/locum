import { FriendsModel, UserModel } from "../models";
import { FriendLocationModel } from "../models/FriendLocationModel";
import { IFriend, IUserLocation } from "../types";

export class FriendLocationViewModel {

  friendsModel: FriendsModel
  userModel: UserModel
  friendLocationModel: FriendLocationModel

  constructor(friendsModel: FriendsModel, userModel: UserModel, friendLocationModel: FriendLocationModel) {
    this.friendsModel = friendsModel
    this.userModel = userModel
    this.friendLocationModel = friendLocationModel
  }


  public async getFriendLocations(hasFriendLocationsCallback: FriendLocationCallback, errorCallback: FriendLocationCallback): Promise<void> {
    let friends = await this.friendsModel.getFriendsLocally()
    if (friends.length == 0) {
      friends = await this.friendsModel.getFriendsFromServer()
    }
    if (friends) {
      const locations = await this.friendLocationModel.getLatestLocations(friends)
      if (locations) {
        return hasFriendLocationsCallback(locations)
      }
      errorCallback(locations);
    }
  }

  public async subscribeToFriendLocationUpdates(hasFriendLocationsCallback: FriendLocationCallback, errorCallback: FriendLocationCallback): Promise<void> {

    setInterval(async () => this.getFriendLocations(hasFriendLocationsCallback, errorCallback), 20_000)
  }

}

type FriendLocationCallback = (locations: IUserLocation[]) => void