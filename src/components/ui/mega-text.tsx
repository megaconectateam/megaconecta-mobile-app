import { PropsWithChildren } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';

import { Colors } from '../../themes';

export enum FontType {
  'black' = 'Inter-Black',
  'bold' = 'Inter-Bold',
  'extraBold' = 'Inter-ExtraBold',
  'extraLight' = 'Inter-ExtraLight',
  'light' = 'Inter-Light',
  'medium' = 'Inter-Medium',
  'regular' = 'Inter-Regular',
  'semiBold' = 'Inter-SemiBold',
  'thin' = 'Inter-Thin',
}

export type MegaTextProps = {
  styles?: StyleProp<TextStyle>;
  font?: FontType;
  size?: number;
  nativeProps?: TextProps;
};

export const MegaText = (props: PropsWithChildren<MegaTextProps>) => {
  return (
    <Text
      style={[
        styles.text,
        props?.styles,
        { fontFamily: props.font ? props.font.toString() : 'Inter-Regular' },
        { fontSize: props.size ? props.size : 15 },
      ]}
      {...props?.nativeProps}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-Regular',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.regularText,
  },
});
