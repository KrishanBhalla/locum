import { View } from 'react-native';
import React from 'react'
import { FriendsViewModel, UserViewModel } from '../../viewmodels';
import { Button, useTheme } from 'react-native-paper';
import { IFriend } from '../../types';
import { styles } from './styles';
import { SearchPage } from './SearchPage'
import { FriendsPage } from './FriendsPage';
import { FriendRequestsPage } from './FriendRequestPage';

interface FriendsScreenProps {
  userViewModel: UserViewModel,
  friendsViewModel: FriendsViewModel,
}

/**
 * A Friends page needs:
 * 1. A search bar to find new people to share your location with
 * 2. A "share location" button to add people (maybe takes you to the "share location page?")
 *   a. That person will need to accept this
 * 3. A list of the friends you have
 * 
 * That means a user needs a UserMosek , which connects to the server, finds the list of MyFriends, and updates the list on drag.
 * Each friend should have a "friend" page. That means clicking on the friend needs to navigate you, (where you can see a heatmap of where they go?)
 */
export const FriendsScreen = ({ userViewModel, friendsViewModel }: FriendsScreenProps) => {

  const { colors } = useTheme()
  const [allFriends, setAllFriends] = React.useState<IFriend[]>([])
  const [allFriendRequests, setAllFriendRequests] = React.useState<IFriend[]>([])
  const [tabSelection, setTabSelection] = React.useState<FRIEND_TAB>("Friends")
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [searchResults, setSearchResults] = React.useState<IFriend[]>([]);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query)
    userViewModel.queryUsers(query, async (res) => setSearchResults(res))
  };
  const updateFriends = () => friendsViewModel.getFriends(async (friends) => setAllFriends(friends), async (_) => {setAllFriends([])})
  const updateFriendRequests = () => friendsViewModel.getFriendRequests(async (friendRequests) => setAllFriendRequests(friendRequests), async (_) => {setAllFriendRequests([])})
  const onFriendRequestClick = (userToFollow: string) => friendsViewModel.sendFriendRequest(userToFollow)
    
  const onRefresh = () => {
    setRefreshing(true)
    updateFriends()
    updateFriendRequests()
    setRefreshing(false)
  }

  const onFriendRequestResponse = async (userToFollow: string, response: boolean) => {
    await friendsViewModel.respondToFriendRequest(userToFollow, response)
    onRefresh()
  }
  
  React.useEffect(() => {
    switch(tabSelection) {
      case "Friends":
        updateFriends()
      case 'Search':
        // pass
      case 'Friend Requests':
        updateFriendRequests()
    }
  }, [tabSelection])

  const getPage = () => { 
    switch (tabSelection) {
      case "Friends":
        return FriendsPage({
          refreshing: refreshing,
          onRefresh: onRefresh,
          allFriends: allFriends
        })
      case "Search":
        return SearchPage({
          colors: colors, 
          allFriends: allFriends, 
          searchResults: searchResults, 
          onChangeSearch: onChangeSearch, 
          onFriendRequestClick: onFriendRequestClick, 
          searchQuery: searchQuery
        })
      case "Friend Requests":
        return FriendRequestsPage({
          refreshing: refreshing,
          onRefresh: onRefresh,
          allFriendRequests: allFriendRequests,
          onFriendRequestResponse: onFriendRequestResponse
        })
    }
  }
  return (
    <View style={styles.container}>
      {getPage()}
      <View style={styles.buttonContainer}>
        {friendTabs(tabSelection, setTabSelection, colors)}
      </View>
    </View>
  )
}


function friendTabs(selectedTab: FRIEND_TAB, updateSelectedTab: (tab: FRIEND_TAB) => void, colors: ReactNativePaper.ThemeColors): React.ReactNode[] {
  let friendTabs: FRIEND_TAB[] = ["Friends", "Friend Requests", "Search"]
  let buttons = []

  let buttonMode = (tab: string) => (tab === selectedTab ? 'contained' : 'outlined')

  for (let tab of friendTabs) {
    let btn = <Button
      key={tab}
      style={styles.button}
      color={colors.accent}
      compact={true}
      mode={buttonMode(tab)}
      onPress={() => updateSelectedTab(tab)}
      >
        {tab}
      </Button>
    buttons.push(btn)
  }
  return buttons
}


type FRIEND_TAB = "Friends" | "Search" | "Friend Requests"
