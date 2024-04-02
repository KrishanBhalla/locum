import { ScrollView, RefreshControl } from 'react-native';
import React from 'react'
import { List } from 'react-native-paper';
import { styles } from './styles';
import { IFriend } from '../../types';

interface FriendRequestsPageProps {
    refreshing: boolean
    onRefresh: () => void
    allFriendRequests: IFriend[]
}

export function FriendRequestsPage({refreshing, onRefresh, allFriendRequests}: FriendRequestsPageProps): React.ReactNode {
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
                return <List.Icon icon="account"/>
                }}
            />)
            }
        </List.Section>
    </ScrollView>
    )
}