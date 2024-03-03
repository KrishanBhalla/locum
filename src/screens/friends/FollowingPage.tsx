import { ScrollView, RefreshControl } from 'react-native';
import React from 'react'
import { List } from 'react-native-paper';
import { styles } from './styles';
import { IFriend } from '../../types';

interface FollowingPageProps {
    refreshing: boolean
    onRefresh: () => void
    allFollowing: IFriend[]
}

export const FollowingPage = ({refreshing, onRefresh, allFollowing}: FollowingPageProps) => (
    <ScrollView style={styles.innerContainer}>
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        <List.Subheader>Shared With You:</List.Subheader>
        <List.Section key="following-list">
        {allFollowing.map(f => 
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