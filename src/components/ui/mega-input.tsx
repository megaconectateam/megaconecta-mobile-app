import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Colors } from '../../themes';
import { MegaLabel } from './mega-label';
import { MegaText } from './mega-text';

import { NAUTA_SUFFIX } from '../../utils';

export type MegaInputProps = {
  nativeProps: TextInputProps;
  errorMessage?: string;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  label?: string;
  isNautaField?: boolean;
  value: string;
  inputStyles?: StyleProp<TextStyle>;
  isLabelTransparent?: boolean;
  onChangeText?: (text: string) => void;
  onValidationError?: (error: string) => void;
};

export const MegaInput = (props: MegaInputProps) => {
  const { t } = useTranslation();

  const onTextChange = async (text: string) => {
    props.onChangeText && props.onChangeText(text);
    if (!props.isNautaField) {
      return;
    }

    const email = `${text}${NAUTA_SUFFIX}`;
    const isValid = await yup.string().email().isValid(email);

    if (!isValid) {
      props.onValidationError &&
        props.onValidationError(t('validationEmailInvalid'));
    } else {
      props.onValidationError && props.onValidationError('');
    }
  };

  return (
    <>
      <View
        style={[
          styles.container,
          !!props.errorMessage && styles.inputWithError,
        ]}
      >
        {props.label && (
          <View
            style={[
              styles.labelContainer,
              props.isLabelTransparent && { backgroundColor: 'transparent' },
            ]}
          >
            <MegaLabel>{props.label}</MegaLabel>
          </View>
        )}

        {props.iconLeft && (
          <View style={styles.iconLeftContainer}>{props.iconLeft}</View>
        )}

        <View style={{ flex: 1 }}>
          <TextInput
            style={[
              styles.input,
              !!props.iconRight && styles.inputWithRightIcon,
              !!props.iconLeft && styles.inputWithLeftIcon,
              !!props.inputStyles && props.inputStyles,
            ]}
            placeholderTextColor={Colors.label}
            {...props.nativeProps}
            value={props.value}
            multiline={false}
            onChangeText={onTextChange}
          />
        </View>

        {props.iconRight && !props.isNautaField && (
          <View style={styles.iconRightContainer}>{props.iconRight}</View>
        )}

        {props.isNautaField && (
          <View style={styles.textRightContainer}>
            <MegaText>{NAUTA_SUFFIX}</MegaText>
          </View>
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
    height: 55,
    position: 'relative',

    borderRadius: 6,
    backgroundColor: Colors.white,
    borderColor: Colors.borderInput,
    borderWidth: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 55,
    flexGrow: 1,
    borderWidth: 0,
    position: 'relative',
    zIndex: 1,
    padding: 15,
    color: Colors.primary,
    fontSize: 16,
    lineHeight: 16,
    textAlignVertical: 'top',
    paddingTop: 22,
  },
  inputWithError: {
    borderWidth: 1,
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
    top: -14,
    backgroundColor: Colors.white,
    zIndex: 10,
  },
  iconRightContainer: {
    position: 'absolute',
    right: 15,
    top: 17,
    zIndex: 10,
  },
  textRightContainer: {
    zIndex: 10,
    paddingHorizontal: 10,
    borderLeftWidth: 2,
    borderLeftColor: Colors.borderInput,
    height: 30,
    justifyContent: 'center',
  },
  iconLeftContainer: {
    position: 'absolute',
    left: 15,
    top: 17,
    zIndex: 10,
  },
});
