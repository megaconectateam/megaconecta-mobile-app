import { Platform, StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import MaskInput, { MaskInputProps } from 'react-native-mask-input';

import { Colors } from '../../themes';
import { MegaLabel } from './mega-label';
import { MegaText } from './mega-text';

type MegaMaskedInputProps = {
  nativeProps: MaskInputProps;
  errorMessage?: string;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  label?: string;
  value?: string;
  inputStyles?: StyleProp<TextStyle>;

  onChangeText: (
    maskedText: string,
    unmaskedText: string,
    obfuscatedText: string,
  ) => void;
};

export const MegaMaskedInput = (props: MegaMaskedInputProps) => {
  return (
    <>
      <View style={styles.container}>
        {props.label && (
          <View style={styles.labelContainer}>
            <MegaLabel>{props.label}</MegaLabel>
          </View>
        )}

        {props.iconLeft && (
          <View style={styles.iconLeftContainer}>{props.iconLeft}</View>
        )}

        <MaskInput
          style={[
            styles.input,
            props.errorMessage ? styles.inputWithError : undefined,
            props.iconRight ? styles.inputWithRightIcon : undefined,
            props.iconLeft ? styles.inputWithLeftIcon : undefined,
            props.inputStyles && props.inputStyles,
          ]}
          {...props.nativeProps}
          multiline={false}
          value={props.value}
          onChangeText={props.onChangeText}
        />

        {props.iconRight && (
          <View style={styles.iconRightContainer}>{props.iconRight}</View>
        )}
      </View>
      {props.errorMessage && (
        <MegaText
          styles={{
            color: Colors.danger,
          }}
        >
          {props.errorMessage}
        </MegaText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    position: 'relative',
  },
  input: {
    height: 55,
    width: '100%',
    borderRadius: 6,
    backgroundColor: Colors.white,
    borderColor: Colors.borderInput,
    borderWidth: 1,
    position: 'relative',
    zIndex: 1,
    padding: 15,
    color: Colors.primary,
    fontSize: 16,
    lineHeight: 16,
    textAlignVertical: 'center',
    paddingBottom: Platform.OS === 'ios' ? 7 : 10,
  },
  inputWithError: {
    borderColor: Colors.danger,
  },
  inputWithRightIcon: {
    paddingEnd: 50,
  },
  inputWithLeftIcon: {
    paddingStart: 50,
  },
  labelContainer: {
    position: 'absolute',
    left: 15,
    top: -13,
    backgroundColor: Colors.white,
    zIndex: 10,
  },
  iconRightContainer: {
    position: 'absolute',
    right: 15,
    top: 17,
    zIndex: 10,
  },
  iconLeftContainer: {
    position: 'absolute',
    left: 15,
    top: 17,
    zIndex: 10,
  },
});
