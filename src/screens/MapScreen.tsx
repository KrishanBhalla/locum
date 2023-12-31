import React from 'react'
import MapView, { Marker, Circle, Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native'
import LocationModel from '../models';


// Mapbox.setAccessToken('pk.eyJ1Ijoia3Jpc2hhbmJoYWxsYSIsImEiOiJjbHB6OXR3b3IxMTN1MmlxcWg2cDloMm1uIn0.H_OnS65yzAYCsWppQRvzfQ');

interface MapScreenProps {
    location: LocationModel
    region: Region
    onRegionChange: (region: Region) => void
}

const MapScreen = ({location, region, onRegionChange} : MapScreenProps) => {

    return (
        <View style={styles.container}>
            <MapView 
              style={styles.map} 
              region={region}
              onRegionChange={(r, _) => onRegionChange(r)}
              onLongPress={(_) => onRegionChange({latitude: location.latitude, longitude: location.longitude, latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta})}
            >
          <Marker coordinate={{latitude: location.latitude, longitude: location.longitude}} pinColor='rgba(64,128,256,1)'/>
          <Circle center={{latitude: location.latitude, longitude: location.longitude}} radius={2.5} fillColor='rgba(64,128,256,0.5)' strokeColor='rgba(64,128,256,1)'/>
         </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });

export default MapScreen