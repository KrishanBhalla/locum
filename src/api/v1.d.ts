/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/users": {
    /** @description Returns all users from the server */
    post: operations["findUsers"];
  };
  "/login": {
    /** @description Login or sign up */
    post: operations["loginOrSignup"];
  };
  "/friends": {
    /** @description Find all friends */
    get: operations["getFriends"];
    /** @description deletes a single friend based on the userId and friendId supplied */
    delete: operations["deleteFriend"];
  };
  "/friends/requests": {
    /** @description Find all friend requests */
    get: operations["getFriendRequests"];
  };
  "/friends/locations": {
    /** @description Find the locations of all friends */
    get: operations["getLocationsOfFriends"];
  };
  "/friends/request": {
    /** @description Follow a new user */
    post: operations["createFriendRequest"];
  };
  "/friends/response": {
    /** @description Accept or reject a friend request */
    post: operations["updateFriendRequest"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    UserRequest: {
      queryString: string;
    };
    UserResponse: {
      userId: string;
      fullName: string;
    };
    /** @description The location of a user with a timestamp given in epoch millis */
    UserLocation: {
      userId: string;
      latitude: number;
      longitude: number;
      /** Format: int64 */
      timestamp: number;
    };
    LoginRequest: {
      userId: string;
      fullName?: string;
      email?: string;
    };
    LoginResponse: {
      token: string;
    };
    FindFriendsResponse: components["schemas"]["UserResponse"][];
    DeleteFriendRequest: {
      friendId: string;
    };
    GetFriendLocationsResponse: components["schemas"]["UserLocation"][];
    FriendRequestRequest: {
      friendId: string;
    };
    FriendResponseRequest: {
      friendId: string;
      accept: boolean;
    };
    Error: {
      /** Format: int32 */
      code: number;
      message: string;
    };
  };
  responses: {
    /** @description Access token is missing or invalid */
    UnauthorizedError: {
      content: never;
    };
  };
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  /** @description Returns all users from the server */
  findUsers: {
    /** @description User prefix to search */
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserRequest"];
      };
    };
    responses: {
      /** @description User Response */
      200: {
        content: {
          "application/json": components["schemas"]["UserResponse"][];
        };
      };
      401: components["responses"]["UnauthorizedError"];
      /** @description unexpected error */
      default: {
        content: never;
      };
    };
  };
  /** @description Login or sign up */
  loginOrSignup: {
    /** @description User to add */
    requestBody: {
      content: {
        "application/json": components["schemas"]["LoginRequest"];
      };
    };
    responses: {
      /** @description Login Success */
      200: {
        content: {
          "application/json": components["schemas"]["LoginResponse"];
        };
      };
      /** @description unexpected error */
      default: {
        content: never;
      };
    };
  };
  /** @description Find all friends */
  getFriends: {
    responses: {
      /** @description Find Friends Response */
      200: {
        content: {
          "application/json": components["schemas"]["FindFriendsResponse"];
        };
      };
      401: components["responses"]["UnauthorizedError"];
      /** @description unexpected error */
      default: {
        content: never;
      };
    };
  };
  /** @description deletes a single friend based on the userId and friendId supplied */
  deleteFriend: {
    /** @description Friend/User pair to delete */
    requestBody: {
      content: {
        "application/json": components["schemas"]["DeleteFriendRequest"];
      };
    };
    responses: {
      /** @description friend deleted */
      204: {
        content: never;
      };
      401: components["responses"]["UnauthorizedError"];
      /** @description unexpected error */
      default: {
        content: never;
      };
    };
  };
  /** @description Find all friend requests */
  getFriendRequests: {
    responses: {
      /** @description Find Friends Requests Response */
      200: {
        content: {
          "application/json": components["schemas"]["FindFriendsResponse"];
        };
      };
      401: components["responses"]["UnauthorizedError"];
      /** @description unexpected error */
      default: {
        content: never;
      };
    };
  };
  /** @description Find the locations of all friends */
  getLocationsOfFriends: {
    responses: {
      /** @description Get Friend Locations Response */
      200: {
        content: {
          "application/json": components["schemas"]["GetFriendLocationsResponse"];
        };
      };
      401: components["responses"]["UnauthorizedError"];
      /** @description unexpected error */
      default: {
        content: never;
      };
    };
  };
  /** @description Follow a new user */
  createFriendRequest: {
    /** @description User to follow */
    requestBody: {
      content: {
        "application/json": components["schemas"]["FriendRequestRequest"];
      };
    };
    responses: {
      /** @description Friend Request Response */
      200: {
        content: never;
      };
      401: components["responses"]["UnauthorizedError"];
      /** @description unexpected error */
      default: {
        content: never;
      };
    };
  };
  /** @description Accept or reject a friend request */
  updateFriendRequest: {
    /** @description Accepted or denied friend request */
    requestBody: {
      content: {
        "application/json": components["schemas"]["FriendResponseRequest"];
      };
    };
    responses: {
      /** @description Follow Response Response */
      200: {
        content: never;
      };
      401: components["responses"]["UnauthorizedError"];
      /** @description unexpected error */
      default: {
        content: never;
      };
    };
  };
}