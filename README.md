# locum
Frontend for Location sharing app, because Find My Friends doesn't work in Korea

## TODOs

### Client:

* User Login Page
    * User Model
    * User ModelView
    * Login View - use [Apple Auth for now](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
    * Profile View
* User Search page - add friends
* Friend Map View
* Save location to local storage
* Save location history
* Background Location
* Sync to Server
* Share button (hits server)

### Server:

* User DB - login info only (Username )
* User Location DB
* User Friends DB
* Websocket
    * Recieve location of user
    * Request location for friends
