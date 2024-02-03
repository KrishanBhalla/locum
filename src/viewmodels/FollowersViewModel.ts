import { FollowersModel, UserModel } from "../models";
import { IFriend } from "../types";

export class FollowersViewModel {

  followersModel: FollowersModel
  userModel: UserModel

  constructor(followersModel: FollowersModel, userModel: UserModel) {
    this.followersModel = followersModel
    this.userModel = userModel
  }

  private async getUserId(): Promise<string> {
    return this.userModel.getTokenLocally()
  }

  public async getFollowers(hasFollowersCallback: FollowersCallback, errorCallback: FollowersCallback): Promise<void> {
    let result = await this.followersModel.getFollowersLocally();
    if (result && result.length > 0) {
      hasFollowersCallback(result)
      return
    }
    this.updateFollowers(hasFollowersCallback, errorCallback)
  }

  public async updateFollowers(hasFollowersCallback: FollowersCallback, errorCallback: FollowersCallback): Promise<void> {
    let userId = await this.getUserId()
    let result = await this.followersModel.getFollowersFromServer(userId);
    if (result) {
      this.followersModel.saveFollowersLocally(result)
      hasFollowersCallback(result)
    }
    errorCallback(result);
  }
}

type FollowersCallback = (result: IFriend[]) => Promise<void>