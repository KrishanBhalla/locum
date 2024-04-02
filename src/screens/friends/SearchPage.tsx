import { View, ScrollView } from "react-native"
import { List, Button, Searchbar } from 'react-native-paper';
import { IFriend } from "../../types"
import { styles } from './styles';

export interface SearchPageProps {
    colors: ReactNativePaper.ThemeColors,
    allFriends: IFriend[],
    searchResults: IFriend[],
    onChangeSearch: (query: string) => void,
    onFriendRequestClick: (userToFollow: string) => void,
    searchQuery: string
  }
  
export const SearchPage = ({
    colors,
    allFriends,
    searchResults,
    onChangeSearch,
    onFriendRequestClick,
    searchQuery
    }: SearchPageProps) => {
  
    let friendsMap = new Set<string>()
  
    allFriends.forEach(f => friendsMap.add(f.userId))
  
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
        </View>
        <ScrollView style={styles.innerContainer}>
          <List.Section key="friend-list">
            {searchResults.map(f => 
              <List.Item 
                key={f.userId}
                title={f.name}
                left={() => {
                  return  <List.Icon style={styles.listItemContainer} icon="account"/>
                }}
                right={() => {
                  let conditionalButton = <Button style={styles.buttonContainer} onPress={() => {
                    // TODO: View Profile
                    return
                  }}>View Profile</Button>
                  if (!friendsMap.has(f.userId)) {
                    conditionalButton = <Button style={styles.buttonContainer} mode="outlined" color={colors.accent} onPress={() => onFriendRequestClick(f.userId)}>Send Friend Request</Button>
                  }
                  return conditionalButton
                }}
              />)
            }
          </List.Section>
        </ScrollView>
      </View>
    );
  }