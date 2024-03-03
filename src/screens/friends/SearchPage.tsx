import { View, ScrollView } from "react-native"
import { List, Button, Searchbar } from 'react-native-paper';
import { IFriend } from "../../types"
import { styles } from './styles';

export interface SearchPageProps {
    colors: ReactNativePaper.ThemeColors,
    allFollowers: IFriend[],
    allFollowing: IFriend[],
    searchResults: IFriend[],
    onChangeSearch: (query: string) => void,
    onFollowRequestClick: (userToFollow: string) => void,
    searchQuery: string
  }
  
export const SearchPage = ({
    colors,
    allFollowers,
    allFollowing,
    searchResults,
    onChangeSearch,
    onFollowRequestClick,
    searchQuery
    }: SearchPageProps) => {
  
    let followingMap = new Set<string>()
    let followersMap = new Set<string>()
  
    allFollowers.forEach(f => followersMap.add(f.userId))
    allFollowing.forEach(f => followingMap.add(f.userId))
  
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
          <List.Section key="following-list">
            {searchResults.map(f => 
              <List.Item 
                key={f.userId}
                title={f.name + (followersMap.has(f.userId) ? " (follows you)" : "")}
                left={() => {
                  return  <List.Icon style={styles.listItemContainer} icon="account"/>
                }}
                right={() => {
                  let conditionalButton = <Button style={styles.buttonContainer} onPress={() => {
                    // TODO: View Profile
                    return
                  }}>View Profile</Button>
                  if (!followingMap.has(f.userId)) {
                    conditionalButton = <Button style={styles.buttonContainer} mode="outlined" color={colors.accent} onPress={() => onFollowRequestClick(f.userId)}>Follow</Button>
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