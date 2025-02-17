import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

export type MegaGradientProps = {
  color1?: string;
  color2?: string;
  flexDirection?: 'row' | 'column';
  styles?: StyleProp<ViewStyle>;
  icon?: JSX.Element;
};

export const MegaGradient = ({
  children,
  color1 = '#E4F6C3',
  color2 = '#E1EEE7',
  flexDirection = 'row',
  styles,
  icon,
}: PropsWithChildren<MegaGradientProps>) => {
  return (
    <LinearGradient
      colors={[color1, color2]}
      start={[0, 0]}
      end={[0, 1]}
      style={[
        { flexDirection },
        !!styles && styles,
        !!icon && iconStyles.withIcon,
      ]}
    >
      {icon ?? children}
    </LinearGradient>
  );
};

const iconStyles = StyleSheet.create({
  withIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});
