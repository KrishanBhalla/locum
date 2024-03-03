import { ScrollView, RefreshControl } from 'react-native';
import React from 'react'
import { List } from 'react-native-paper';
import { styles } from './styles';
import { IFriend } from '../../types';

interface FollowersPageProps {
    refreshing: boolean
    onRefresh: () => void
    allFollowers: IFriend[]
}

export const FollowersPage =({refreshing, onRefresh, allFollowers}: FollowersPageProps) => (
    <ScrollView style={styles.innerContainer}>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        <List.Subheader>Location Shared With:</List.Subheader>
        <List.Section key="followers-list">
            {allFollowers.map(f => 
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