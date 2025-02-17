import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { GenericList } from '../../models';
import { Colors } from '../../themes';
import { getMaskByCountry } from '../../utils';
import { Flag, MegaLabel, MegaText } from '../ui';

export type InputCountrySelectorProps = {
  countryList: GenericList[];
  selectedCountry: GenericList;
  label?: string;
  defaultValue?: string;
  isEdit?: boolean;
  onChangeText: (value: string) => void;
  errorMessage?: string;

  onOpenSelector?: () => void;
  onSelectCountry: (country: GenericList) => void;
};

export const InputCountrySelector = (props: InputCountrySelectorProps) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const defaultPhone = props.isEdit
    ? (props.defaultValue || '').replace(
        props.selectedCountry.extraLabel || '',
        '',
      )
    : '';

  const [selectedItem, setSelectedItem] = useState<GenericList>(
    props.selectedCountry,
  );
  const [mask, setMask] = useState<any[]>([]);
  const [maskPlaceholderChar, setMaskPlaceholderChar] = useState<string>('');
  const [phone, setPhone] = useState<{ masked: string; value: string }>({
    value: props.defaultValue || '',
    masked: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>(defaultPhone || '');

  useEffect(() => {
    const countryCode = (props.selectedCountry.extraLabel || '').replace(
      '+',
      '',
    );

    const defaultPhone = props.isEdit
      ? (props.defaultValue || '').replace(countryCode, '')
      : '';

    setPhone({ masked: '', value: defaultPhone || '' });
  }, []);

  useEffect(() => {
    const m = getMask();

    if (m.length === 0) {
      setMaskPlaceholderChar('');
      setMask([
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]);
    } else {
      setMaskPlaceholderChar('_');
      setMask(m);
    }
  }, [props.selectedCountry]);

  useEffect(() => {
    setErrorMessage(props.errorMessage || '');
  }, [props.errorMessage]);

  const label = props.label || t('phone');

  const getMask = () => {
    const mask = selectedItem.phoneMask;

    if (mask) {
      return getMaskByCountry(mask, true);
    }

    return [];
  };

  const onOpenSelector = () => {
    if (props.isEdit) {
      return;
    }

    props.onOpenSelector && props.onOpenSelector();

    // @ts-ignore
    navigate('CountrySelectorModal', {
      onSelectItem: handleSelectItem,
      countryList: props.countryList,
    });
  };

  const handleSelectItem = (item: GenericList) => {
    if (item.value !== selectedItem.value) {
      setSelectedItem(item);
      props.onSelectCountry(item);
      setPhone({ value: '', masked: '' });
    }
  };

  const onPhoneChange = (maskedText: string, unmaskedText: string) => {
    setPhone({
      masked: maskedText,
      value: unmaskedText,
    });

    verifyPhone(maskedText);
  };

  const verifyPhone = (maskedText: string, displayError?: boolean) => {
    if (getMask().length !== maskedText.length) {
      if (displayError) {
        setErrorMessage(t('phoneNotValid'));
      }

      if (maskPlaceholderChar) {
        return false;
      }
    }

    setErrorMessage('');
    props.onChangeText(maskedText);
    return true;
  };

  return (
    <View>
      <View
        style={[styles.container, !!errorMessage && styles.containerWithError]}
      >
        <View style={styles.labelContainer}>
          <MegaLabel>{label}</MegaLabel>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            disabled={props.isEdit}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onOpenSelector}
          >
            <View style={{ paddingLeft: 16, paddingRight: 5 }}>
              <Flag
                name={selectedItem.value}
                styles={{ width: 20, height: 20 }}
              />
            </View>
            <MegaText size={16} styles={{ marginRight: 10 }}>
              {selectedItem.extraLabel}
            </MegaText>
            <View
              style={{
                height: 25,
                width: 1,
                borderLeftColor: Colors.borderInput,
                borderLeftWidth: 1,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 10, flexGrow: 1 }}>
          <MaskInput
            style={[styles.input]}
            keyboardType="phone-pad"
            mask={mask}
            multiline={false}
            editable={!props.isEdit}
            value={phone.value}
            onChangeText={onPhoneChange}
            placeholderFillCharacter={maskPlaceholderChar}
            onBlur={() => {
              console.log('onBlur');
              verifyPhone(phone.masked, true);
            }}
          />
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
