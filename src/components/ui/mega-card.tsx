import { PropsWithChildren } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Colors, themeStyles } from '../../themes';

export type MegaCardProps = {
  containerStyles?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export const MegaCard = ({
  children,
  containerStyles,
  onPress,
}: PropsWithChildren<MegaCardProps>) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.5 : 1}>
      <View style={[styles.container, containerStyles && containerStyles]}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    ...themeStyles.shadow,
  },
});
