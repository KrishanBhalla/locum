import { View } from 'react-native';
import React from 'react'
import { FriendLocationViewModel, FriendsViewModel, UserViewModel } from '../../viewmodels';
import { Button, useTheme } from 'react-native-paper';
import { IFriend } from '../../types';
import { styles } from './styles';
import { SearchPage } from './SearchPage'
import { FriendsListPage } from './FriendsListPage';
import { FriendRequestsPage } from './FriendRequestPage';
import { FriendPage } from './FriendPage';
import { FRIEND_TAB } from './types';

interface FriendsScreenProps {
  userViewModel: UserViewModel,
  friendsViewModel: FriendsViewModel,
  friendLocationViewModel: FriendLocationViewModel
}

/**
 * A Friends page needs:
 * 1. A search bar to find new people to share your location with
 * 2. A "share location" button to add people (maybe takes you to the "share location page?")
 *   a. That person will need to accept this
 * 3. A list of the friends you have
 * 
 * That means a user needs a UserModel , which connects to the server, finds the list of MyFriends, and updates the list on drag.
 * Each friend should have a "friend" page. That means clicking on the friend needs to navigate you, (where you can see a heatmap of where they go?)
 */
export const FriendsScreen = ({ userViewModel, friendsViewModel, friendLocationViewModel }: FriendsScreenProps) => {

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

  const getFriends = () => friendsViewModel.getFriends((friends) => setAllFriends(friends), (_) => {setAllFriends([])})
  const getFriendRequests = () => friendsViewModel.getFriendRequests((friendRequests) => setAllFriendRequests(friendRequests), (_) => {setAllFriendRequests([])})
  const updateFriends = () => friendsViewModel.updateFriends((friends) => setAllFriends(friends), (_) => {setAllFriends([])})
  const updateFriendRequests = () => friendsViewModel.updateFriendRequests((friendRequests) => setAllFriendRequests(friendRequests), (_) => {setAllFriendRequests([])})
  const onFriendRequestClick = (userToFollow: string) => friendsViewModel.sendFriendRequest(userToFollow)
    
  const onRefresh = async () => {
    setRefreshing(true)
    const updateFriendsPromise = updateFriends()
    const updateFriendRequestsPromise = updateFriendRequests()
    await Promise.all([updateFriendRequestsPromise, updateFriendsPromise])
    const getFriendsPromise = getFriends()
    const getFriendRequestsPromise = getFriendRequests()
    await Promise.all([getFriendsPromise, getFriendRequestsPromise])
    setRefreshing(false)
  }

  const onFriendRequestResponse = async (userToFollow: string, response: boolean) => {
    await friendsViewModel.respondToFriendRequest(userToFollow, response)
    onRefresh()
  }
  

  React.useEffect(() => {
    switch(tabSelection) {
      case "Friends":
        getFriends()
      case 'Search':
        // pass
      case 'Friend Requests':
        getFriendRequests()
    }
  }, [tabSelection])

  const getPage = () => { 
    switch (tabSelection) {
      case "Friends":
        return FriendsListPage({
          refreshing: refreshing,
          onRefresh: onRefresh,
          allFriends: allFriends,
          setTabSelection: (tab: FRIEND_TAB) => setTabSelection(tab)
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
        case "Single Friend Page":
          return FriendPage({
            friend: null,
            friendLocationViewModel: friendLocationViewModel
          })
    }
  }
  return (
    <View style={styles.container}>
      {getPage()}
      <View style={styles.buttonContainer}>
        {selectableFriendTabs(tabSelection, setTabSelection, colors)}
      </View>
    </View>
  )
}


function selectableFriendTabs(selectedTab: FRIEND_TAB, updateSelectedTab: (tab: FRIEND_TAB) => void, colors: ReactNativePaper.ThemeColors): React.ReactNode[] {
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


