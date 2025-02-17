import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const themeStyles = StyleSheet.create({
  regular16: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 29,
    fontStyle: 'normal',
  },
  shadow: {
    shadowColor: '#030047',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  errorContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.danger,
    padding: 10,
  },
});
