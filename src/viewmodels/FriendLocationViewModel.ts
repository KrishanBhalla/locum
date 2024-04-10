import { FriendsModel, UserModel } from "../models";
import { FriendLocationModel } from "../models/FriendLocationModel";
import { IFriend, IUserLocation } from "../types";

export class FriendLocationViewModel {

  friendsModel: FriendsModel
  userModel: UserModel
  friendLocationModel: FriendLocationModel
  refreshIntervalMillis: number

  constructor(friendsModel: FriendsModel, userModel: UserModel, friendLocationModel: FriendLocationModel) {
    this.friendsModel = friendsModel
    this.userModel = userModel
    this.friendLocationModel = friendLocationModel
    this.refreshIntervalMillis = 10_000
  }


  public async getFriendLocations(hasFriendLocationsCallback: FriendsLocationCallback, errorCallback: FriendsLocationCallback): Promise<void> {
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

  public async subscribeToFriendLocationUpdates(hasFriendLocationsCallback: FriendsLocationCallback, errorCallback: FriendsLocationCallback): Promise<void> {

    setInterval(async () => this.getFriendLocations(hasFriendLocationsCallback, errorCallback), this.refreshIntervalMillis)
  }

  public async getSingleFriendLocation(friend: IFriend, hasFriendLocationsCallback: SingleFriendLocationCallback, errorCallback: SingleFriendLocationCallback): Promise<void> {
    const locations = await this.friendLocationModel.getLatestLocations([friend])
    if (locations) {
      return hasFriendLocationsCallback(locations[0])
    }
    errorCallback(locations[0]);
  }

  public async subscribeToSingleFriendLocationUpdates(friend: IFriend, hasFriendLocationsCallback: SingleFriendLocationCallback, errorCallback: SingleFriendLocationCallback): Promise<void> {

    setInterval(async () => this.getSingleFriendLocation(friend, hasFriendLocationsCallback, errorCallback), this.refreshIntervalMillis)
  }

}

type FriendsLocationCallback = (locations: IUserLocation[]) => void
type SingleFriendLocationCallback = (location: IUserLocation) => void