import { LinearGradient } from 'expo-linear-gradient';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Colors } from '../../themes';
import { FontType, MegaText } from './mega-text';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'light-secondary'
  | 'light-danger'
  | 'danger'
  | 'link';

export type MegaButtonProps = {
  text: string;
  variant: ButtonVariant;
  linkVariant?: 'secondary' | 'dark';
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  height?: number;
  containerStyles?: ViewStyle;
  gradientStyles?: ViewStyle;
};

export const MegaButton = (props: MegaButtonProps) => {
  let buttonStyles = {
    bgColors: [Colors.primary],
    textColor: Colors.white,
  };

  switch (props.variant) {
    case 'primary':
      buttonStyles = {
        bgColors: [Colors.primary, Colors.primary],
        textColor: Colors.white,
      };
      break;

    case 'secondary':
      buttonStyles = props.disabled
        ? {
            bgColors: ['#C4DC99', '#C4DC99'],
            textColor: Colors.white,
          }
        : {
            bgColors: [Colors.darkGreen, Colors.darkGreen],
            textColor: Colors.white,
          };
      break;

    case 'light-secondary':
      buttonStyles = {
        bgColors: ['#E4F6C3', '#E1EEE7'],
        textColor: Colors.primary,
      };
      break;

    case 'link':
      buttonStyles = {
        bgColors: ['transparent', 'transparent'],
        textColor:
          props.linkVariant === 'dark' ? Colors.darkerGreen : Colors.darkGreen,
      };
      break;

    case 'light-danger':
      buttonStyles = {
        bgColors: ['#F3F1F6', '#FFDEE8'],
        textColor: Colors.primary,
      };
      break;

    case 'danger':
      buttonStyles = {
        bgColors: [Colors.danger, Colors.danger],
        textColor: Colors.white,
      };
      break;
  }

  return (
    <View style={[styles.container, props.containerStyles]}>
      <TouchableOpacity
        style={[styles.button, !!props.height && { height: props.height }]}
        onPress={props.onPress}
        disabled={props.disabled}
        activeOpacity={0.5}
      >
        <LinearGradient
          colors={[...buttonStyles.bgColors]}
          style={[
            styles.gradient,
            props.gradientStyles && props.gradientStyles,
          ]}
        >
          {props.iconLeft && (
            <View style={{ marginRight: 5 }}>{props.iconLeft}</View>
          )}

          <MegaText
            styles={{ color: buttonStyles.textColor, lineHeight: 20 }}
            font={FontType.medium}
            size={16}
          >
            {props.text}
          </MegaText>

          {props.iconRight && (
            <View style={{ marginLeft: 5 }}>{props.iconRight}</View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  button: {
    height: 50,
    borderRadius: 8,
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: Colors.darkGreen,
    color: Colors.white,
  },
  lightSecondaryButton: {},
});
