import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import * as yup from 'yup';
import { Colors } from '../../themes';
import { MegaLabel, MegaText } from '../ui';

export type InputNautaProps = {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  defaultValue?: string;
  onChangeText: (value: string) => void;
};

export const NAUTA_SUFFIX = '@nauta.com.cu';

/**
 * @deprecated use the MegaInput component instead, with the isNautaField prop
 */
export const InputNauta = (props: InputNautaProps) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string>(
    props.errorMessage || '',
  );
  const [nauta, setNauta] = useState<string>(
    (props.defaultValue || '').replace(NAUTA_SUFFIX, '') || '',
  );

  const onChangeText = async (value: string) => {
    const email = `${value}${NAUTA_SUFFIX}`;
    setNauta(value);

    const isValid = await yup.string().email().isValid(email);

    if (isValid) {
      setErrorMessage('');
      props.onChangeText(email);
    } else {
      setErrorMessage(t('validationEmailInvalid'));
    }
  };

  return (
    <View>
      <View
        style={[styles.container, !!errorMessage && styles.containerWithError]}
      >
        {!!props.label && (
          <View style={styles.labelContainer}>
            <MegaLabel>{props.label}</MegaLabel>
          </View>
        )}

        <View style={{ paddingHorizontal: 10, flexGrow: 1 }}>
          <TextInput
            style={[styles.input]}
            keyboardType="email-address"
            multiline={false}
            value={nauta}
            onChangeText={onChangeText}
            placeholder={props.placeholder}
            placeholderTextColor={Colors.label}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingRight: 16,
          }}
        >
          <View
            style={{
              height: 25,
              width: 1,
              borderLeftColor: Colors.borderInput,
              borderLeftWidth: 1,
              paddingEnd: 16,
            }}
          />

          <MegaText
            size={16}
            styles={{ lineHeight: 27, color: Colors.primary }}
          >
            {NAUTA_SUFFIX}
          </MegaText>
        </View>
      </View>

      {errorMessage && (
        <MegaText
          styles={{
            color: Colors.danger,
          }}
        >
          {errorMessage}
        </MegaText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 6,
    position: 'relative',
    alignItems: 'center',
  },
  containerWithError: {
    borderColor: Colors.danger,
  },
  labelContainer: {
    position: 'absolute',
    left: 15,
    top: -13,
    backgroundColor: Colors.white,
    zIndex: 10,
  },
  input: {
    height: 55,
    width: '100%',
    backgroundColor: Colors.white,
    fontSize: 16,
    color: Colors.primary,
    lineHeight: 16,
    textAlignVertical: 'center',
    paddingTop: Platform.OS === 'ios' ? 7 : 0,
    paddingHorizontal: 5,
  },
});
