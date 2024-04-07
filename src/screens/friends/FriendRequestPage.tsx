import { View, ScrollView, RefreshControl } from 'react-native';
import React from 'react'
import { List, IconButton, Colors } from 'react-native-paper';
import { styles } from './styles';
import { IFriend } from '../../types';

interface FriendRequestsPageProps {
    refreshing: boolean
    onRefresh: () => void
    allFriendRequests: IFriend[]
    onFriendRequestResponse: (userToFollow: string, response: boolean) => void,
}

export function FriendRequestsPage({refreshing, onRefresh, allFriendRequests, onFriendRequestResponse}: FriendRequestsPageProps): React.ReactNode {
    
    return (
    <ScrollView style={styles.innerContainer}>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        <List.Subheader>Location Shared With:</List.Subheader>
        <List.Section key="friend-requests-list">
            {allFriendRequests.map(f => 
            <List.Item 
                key={f.userId}
                title={f.name}
                left={() => {
                  return  <List.Icon style={styles.listItemContainer} icon="account"/>
                }}
                right={() => {
                  let acceptButton = <IconButton icon="check" color={Colors.green500} onPress={() => onFriendRequestResponse(f.userId, true)} disabled={refreshing}/>
                  let rejectButton = <IconButton icon="close" color={Colors.red500} onPress={() => onFriendRequestResponse(f.userId, false)} disabled={refreshing}/>
                  return <View style={styles.listItemContainer}>
                      {acceptButton}
                      {rejectButton}
                     </View>
                }}
                
            />)
            }
        </List.Section>
    </ScrollView>
    )
}