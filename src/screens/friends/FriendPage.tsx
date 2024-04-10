import React from 'react'
import MapView, { Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native'
import { useTheme, Avatar, Title, Button } from 'react-native-paper';
import * as mapFunctions from '../mapFunctions';
import { IFriend, IUserLocation } from '../../types';
import { FriendLocationViewModel } from '../../viewmodels';

interface FriendPageProps {
  friend: IFriend,
  friendLocationViewModel: FriendLocationViewModel
}

export const FriendPage = ({ friend, friendLocationViewModel }: FriendPageProps) => {

  const theme = useTheme();
  const [friendLocation, setFriendLocation] = React.useState<IUserLocation>()
  const [region, setRegion] = React.useState<Region>()
  const [isRegionSetManually, setIsRegionSetManually] = React.useState<boolean>(false)


  // Setup refs and animated effects
  let mapRef: MapView = new MapView({})

  React.useEffect(() => {
    const init = async () => {
      await friendLocationViewModel.getSingleFriendLocation(friend, (loc: IUserLocation) => setFriendLocation(loc), () => null)
      friendLocationViewModel.subscribeToSingleFriendLocationUpdates(friend, (loc) => setFriendLocation(loc), (_) => null)
    }
    init()
  }, [])

  React.useEffect(() => {
      if (!isRegionSetManually) {
        setRegion({
            latitude: friendLocation.coords.latitude,
            longitude: friendLocation.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        })
    }
  }, [friendLocation, isRegionSetManually])


  return (
    <View>
      <Avatar.Icon icon="account"/>
      <Title>{friend.name}</Title>
      <Button onPress={() => null}>Remove Friend (TODO)</Button>
      <MapView
        style={localStyles.map}
        region={region}
        onRegionChange={(region) => {
            setIsRegionSetManually(true)
            setRegion(region)
        }}
        userInterfaceStyle={theme.dark ? 'dark' : 'light'}
        ref={(ref) => mapRef = ref}
      >
        {mapFunctions.mapMarkerBackgroundCircle(friendLocation.coords)}
        {mapFunctions.mapMarker(friendLocation.coords)}
      </MapView>
    </View>
  )
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottom: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
