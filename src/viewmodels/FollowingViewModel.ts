import { FollowingModel, UserModel } from "../models";
import { IFriend } from "../types";

export class FollowingViewModel {

  followingModel: FollowingModel
  userModel: UserModel

  constructor(followingModel: FollowingModel, userModel: UserModel) {
    this.followingModel = followingModel
    this.userModel = userModel
  }

  private async getUserId(): Promise<string> {
    return this.userModel.getTokenLocally()
  }

  public async getFollowing(hasFollowingCallback: FollowingCallback, errorCallback: FollowingCallback): Promise<void> {
    let result = await this.followingModel.getFollowingLocally();
    if (result && result.length > 0) {
      hasFollowingCallback(result)
      return
    }
    this.updateFollowing(hasFollowingCallback, errorCallback)
  }

  public async updateFollowing(hasFollowingCallback: FollowingCallback, errorCallback: FollowingCallback): Promise<void> {
    let userId = await this.getUserId()
    let result = await this.followingModel.getFollowingFromServer(userId);
    if (result) {
      this.followingModel.saveFollowingLocally(result)
      hasFollowingCallback(result)
    }
    errorCallback(result);
  }
}

type FollowingCallback = (result: IFriend[]) => Promise<void>