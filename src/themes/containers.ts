import { StyleSheet } from 'react-native';

import { Colors } from './colors';

export const containerStyles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.white,
  },
});
