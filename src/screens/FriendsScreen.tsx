import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import React from 'react'
import { FollowersViewModel, FollowingViewModel } from '../viewmodels';
import { List, Button, useTheme, Searchbar } from 'react-native-paper';
import { IFriend } from '../types';

interface FriendsScreenProps {
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
export const FriendsScreen = ({ followersViewModel, followingViewModel }: FriendsScreenProps) => {

  const { colors } = useTheme()
  const [allFollowers, setAllFollowers] = React.useState<IFriend[]>([])
  const [allFollowing, setAllFollowing] = React.useState<IFriend[]>([])
  const [tabSelection, setTabSelection] = React.useState<FRIEND_TAB>("Followers")
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const onChangeSearch = (query: string) => setSearchQuery(query);
  const updateFollowers = () => followersViewModel.getFollowers(async (followers) => setAllFollowers(followers), async (_) => {setAllFollowers([])})
  const updateFollowing = () => followingViewModel.getFollowing(async (following) => setAllFollowing(following), async (_) => {setAllFollowing([])})


  const followersPage = () => (
      <ScrollView style={styles.innerContainer}>
      <RefreshControl refreshing={refreshing} onRefresh={() => {
        setRefreshing(true)
        updateFollowers()
        setRefreshing(false)
      }} />
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
    
  const followingPage = () => (
    <ScrollView style={styles.innerContainer}>
    <RefreshControl refreshing={refreshing} onRefresh={() => {
      setRefreshing(true)
      updateFollowing()
      setRefreshing(false)
    }} />
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
  
  React.useEffect(() => {
    switch(tabSelection) {
      case "Followers":
        updateFollowers()
      case "Following":
        updateFollowing()
      case 'Search':
        // pass
    }

  }, [tabSelection])

  const getPage = () => { 
    switch (tabSelection) {
      case "Followers":
        return followersPage()
      case "Following":
        return followingPage()
      case "Search":
        return searchPage(allFollowers, allFollowing, onChangeSearch, searchQuery)
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

function searchPage(allFollowers: IFriend[], allFollowing: IFriend[], onChangeSearch: (query: string) => void, searchQuery: string): React.ReactNode {

  return (
    <View style={styles.searchContainer}>
      <Searchbar
        style={styles.searchBar}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: '10%',
    flex: 1,
    flexDirection: 'column',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignSelf:'center'
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  searchBar: {
    borderRadius: 10,
    marginHorizontal: '2.5%'
  },
  buttonContainer: {
    height: 'auto',
    flexDirection: 'row',
  },
  button: {
    flex: 1
  }
});

type FRIEND_TAB = "Following" | "Followers" | "Search"
