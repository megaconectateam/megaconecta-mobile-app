import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { ContactPhone } from '../../models';
import { Colors } from '../../themes';
import { FontType, MegaButton, MegaInput, MegaModal, MegaText } from '../ui';

export type ModalNautaInputProps = {
  isVisible: boolean;

  onClose: () => void;
  onSelected: (contact: ContactPhone) => void;
};

export const ModalNautaInput = ({
  isVisible,
  onSelected,
  onClose,
}: ModalNautaInputProps) => {
  const { t } = useTranslation();
  const [nautaValue, setNautaValue] = useState('');
  const [nautaError, setNautaError] = useState('');

  const onAddNautaAccount = () => {
    if (!nautaValue) {
      return;
    }

    const contact: ContactPhone = {
      id: '-1',
      firstName: 'Nauta',
      lastName: '',
      fullName: 'Nauta',
      phoneNumber: '',
      countryCode: 'cu',
      isMegaconecta: false,
      phoneType: 'mobile',
      initials: '',
      formattedPhone: '',
      emailNauta: nautaValue,
    };

    onSelected(contact);
  };

  return (
    <MegaModal
      isLoading={false}
      modalProps={{
        isVisible,
        scrollHorizontal: false,
        avoidKeyboard: true,
      }}
      modalStyle={styles.view}
    >
      <View style={styles.content}>
        <View
          style={{
            alignItems: 'center',
            position: 'relative',
            marginBottom: 30,
          }}
        >
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{
              lineHeight: 21,
              color: Colors.primary,
              textAlign: 'center',
            }}
          >
            {t('topupSection.enterNauta')}
          </MegaText>

          <View style={{ position: 'absolute', top: 2, right: 0 }}>
            <TouchableOpacity onPress={onClose}>
              <SVGs.CloseIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <MegaInput
            nativeProps={{
              keyboardType: 'email-address',
              placeholder: 'firstName',
              autoComplete: 'email',
              autoCorrect: false,
              autoCapitalize: 'none',
              multiline: false,
              maxLength: 25,
            }}
            value={nautaValue}
            isNautaField
            onChangeText={(text) => setNautaValue(text)}
            errorMessage={nautaError}
            onValidationError={setNautaError}
          />
        </View>

        <View style={{ marginTop: 30, marginBottom: 20 }}>
          <MegaButton
            text="Recargar esta cuenta"
            variant="secondary"
            disabled={!nautaValue || !!nautaError}
            onPress={onAddNautaAccount}
          />
        </View>
      </View>
    </MegaModal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 20,
    backgroundColor: 'white',
    paddingHorizontal: 30,
  },
});
