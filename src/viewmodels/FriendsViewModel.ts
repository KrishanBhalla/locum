import { FriendsModel, UserModel } from "../models";
import { IFriend } from "../types";

export class FriendsViewModel {

  friendsModel: FriendsModel
  userModel: UserModel

  constructor(friendsModel: FriendsModel, userModel: UserModel) {
    this.friendsModel = friendsModel
    this.userModel = userModel
  }

  private async getUserId(): Promise<string> {
    return this.userModel.getTokenLocally()
  }

  public async getFriends(hasFriendsCallback: FriendsCallback, errorCallback: FriendsCallback): Promise<void> {
    let result = await this.friendsModel.getFriendsLocally();
    if (result && result.length > 0) {
      hasFriendsCallback(result)
      return
    }
    this.updateFriends(hasFriendsCallback, errorCallback)
  }

  public async updateFriends(hasFriendsCallback: FriendsCallback, errorCallback: FriendsCallback): Promise<void> {

    let result = await this.friendsModel.getFriendsFromServer();
    if (result) {
      this.friendsModel.saveFriendsLocally(result)
      hasFriendsCallback(result)
    }
    errorCallback(result);
  }

  public async updateFriendRequests(hasFriendRequestsCallback: FriendsCallback, errorCallback: FriendsCallback): Promise<void> {
    
    let result = await this.friendsModel.getFriendRequestsFromServer();
    if (result) {
      this.friendsModel.saveFriendsLocally(result)
      hasFriendRequestsCallback(result)
    }
    errorCallback(result);
  }

  public async respondToFriendRequest(friendUserId: string, requestAccepted: boolean): Promise<void> {
    let userId = await this.getUserId()
    await this.friendsModel.updateFriendRequest(friendUserId, requestAccepted);
  }
  public async sendFriendRequest(toFollowUserId: string): Promise<void> {
    let userId = await this.getUserId()
    await this.friendsModel.sendFriendRequest(toFollowUserId);
  }
}

type FriendsCallback = (result: IFriend[]) => Promise<void>