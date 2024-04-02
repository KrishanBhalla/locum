import { ScrollView, RefreshControl } from 'react-native';
import React from 'react'
import { List } from 'react-native-paper';
import { styles } from './styles';
import { IFriend } from '../../types';

interface FriendsPageProps {
    refreshing: boolean
    onRefresh: () => void
    allFriends: IFriend[]
}

export const FriendsPage =({refreshing, onRefresh, allFriends}: FriendsPageProps) => (
    <ScrollView style={styles.innerContainer}>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        <List.Subheader>Location Shared With:</List.Subheader>
        <List.Section key="friends-list">
            {allFriends.map(f => 
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