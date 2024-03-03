import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: '10%',
    flex: 1,
    flexDirection: 'column',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  searchContainer: {
    height: 'auto',
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
  listItemContainer: {
    height: 'auto',
    flexDirection: 'row',
  },
  button: {
    flex: 1
  }
});