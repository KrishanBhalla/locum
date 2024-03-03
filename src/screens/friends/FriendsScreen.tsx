import { View, ScrollView, RefreshControl } from 'react-native';
import React from 'react'
import { FollowersViewModel, FollowingViewModel, UserViewModel } from '../../viewmodels';
import { List, Button, useTheme, Searchbar } from 'react-native-paper';
import { IFriend } from '../../types';
import { styles } from './styles';
import { SearchPage } from './SearchPage'
import { FollowersPage } from './FollowersPage';
import { FollowingPage } from './FollowingPage';

interface FriendsScreenProps {
  userViewModel: UserViewModel,
  followersViewModel: FollowersViewModel,
  followingViewModel: FollowingViewModel,
}

/**
 * A Followers page needs:
 * 1. A search bar to find new people to share your location with
 * 2. A "share location" button to add people (maybe takes you to the "share location page?")
 *   a. That person will need to accept this
 * 3. A list of the followers you have
 * 
 * That means a user needs a UserMosek , which connects to the server, finds the list of MyFriends, and updates the list on drag.
 * Each friend should have a "friend" page. That means clicking on the friend needs to navigate you, (where you can see a heatmap of where they go?)
 */
export const FriendsScreen = ({ userViewModel, followersViewModel, followingViewModel }: FriendsScreenProps) => {

  const { colors } = useTheme()
  const [allFollowers, setAllFollowers] = React.useState<IFriend[]>([])
  const [allFollowing, setAllFollowing] = React.useState<IFriend[]>([])
  const [tabSelection, setTabSelection] = React.useState<FRIEND_TAB>("Followers")
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [searchResults, setSearchResults] = React.useState<IFriend[]>([]);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query)
    userViewModel.queryUsers(query, async (res) => setSearchResults(res))
  };
  const updateFollowers = () => followersViewModel.getFollowers(async (followers) => setAllFollowers(followers), async (_) => {setAllFollowers([])})
  const updateFollowing = () => followingViewModel.getFollowing(async (following) => setAllFollowing(following), async (_) => {setAllFollowing([])})
  const onFollowRequestClick = (userToFollow: string) => followingViewModel.sendFollowRequest(userToFollow)

    
  const onRefresh = () => {
    setRefreshing(true)
    updateFollowing()
    setRefreshing(false)
  }
  
  React.useEffect(() => {
    switch(tabSelection) {
      case "Followers":
        updateFollowers()
      case "Following":
        updateFollowing()
      case 'Search':
        // pass
      case 'FollowerRequests':
        // pass
    }
  }, [tabSelection])

  const getPage = () => { 
    switch (tabSelection) {
      case "Followers":
        return FollowersPage({
          refreshing: refreshing,
          onRefresh: onRefresh,
          allFollowers: allFollowers
        })
      case "Following":
        return FollowingPage({
          refreshing: refreshing,
          onRefresh: onRefresh,
          allFollowing: allFollowing
        })
      case "Search":
        return SearchPage({
          colors: colors, 
          allFollowers: allFollowers, 
          allFollowing: allFollowing, 
          searchResults: searchResults, 
          onChangeSearch: onChangeSearch, 
          onFollowRequestClick: onFollowRequestClick, 
          searchQuery: searchQuery
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
  let friendTabs: FRIEND_TAB[] = ["Followers", "Following", "Search"]
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


type FRIEND_TAB = "Following" | "Followers" | "Search" | "FollowerRequests"
