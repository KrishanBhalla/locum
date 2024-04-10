import { ScrollView, RefreshControl } from 'react-native';
import React from 'react'
import { List, Button } from 'react-native-paper';
import { styles } from './styles';
import { IFriend } from '../../types';
import { FRIEND_TAB } from './types';

interface FriendsListPageProps {
    refreshing: boolean
    onRefresh: () => void
    allFriends: IFriend[]
    setTabSelection: (tabPage: FRIEND_TAB) => void
    setSelectedFriend: (friend: IFriend) => void,
}

export const FriendsListPage =({
    refreshing,
    onRefresh,
    allFriends,
    setTabSelection,
    setSelectedFriend,
}: FriendsListPageProps) => (
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
                onPress={() => {
                    setTabSelection("Single Friend Page")
                    setSelectedFriend(f)
                }}
            />)
            }
        </List.Section>
    </ScrollView>
)