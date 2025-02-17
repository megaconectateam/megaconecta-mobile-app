import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { SVGs } from '../../assets/svg';
import { PinModal } from '../../components';
import {
  FontType,
  MegaButton,
  MegaGradient,
  MegaInput,
  MegaRadio,
  MegaText,
  ScreenWithKeyboard,
} from '../../components/ui';
import { RootStackParamList } from '../../navigation';
import { useGlobalModalContext, useLoadingContext } from '../../providers';
import { RegisterService } from '../../services';
import { setChangePasswordPhone } from '../../store/features/registerSlice';
import { Colors } from '../../themes';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ForgotPasswordContainer'
>;

export const ForgotPasswordContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { showModal, hideModal } = useGlobalModalContext();
  const dispatch = useDispatch();

  const [phone, setPhone] = useState<string>('');
  const [phoneHasError, setPhoneHasError] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'call'>('sms');
  const [isPinVisible, setIsPinVisible] = useState<boolean>(false);

  useEffect(() => {
    if (phone) {
      setPhoneHasError('');
    }
  }, [phone]);

  const validatePhone = () => {
    if (!phone) {
      setPhoneHasError(t('accountSection.validations.phoneRequired'));
      return true;
    }

    return false;
  };

  const submitForm = async () => {
    Keyboard.dismiss();
    if (validatePhone()) {
      return;
    }

    try {
      setLoading(true);
      const response = await RegisterService.requestForgotPassword(
        phone,
        selectedMethod,
      );

      if (!response.success) {
        switch (response.code) {
          case '003':
            setScreenErrorMessage(
              t('loginSection.validations.003') +
                ' ' +
                t('loginSection.validations.default'),
            );
            break;

          case '004':
            setScreenErrorMessage(
              t('loginSection.validations.004') +
                ' ' +
                t('loginSection.validations.default'),
            );
            break;

          case '002':
          case '500':
          default:
            setScreenErrorMessage(t('loginSection.validations.500'));
            break;
        }
        return;
      }

      setIsPinVisible(true);
    } catch (error) {
      setScreenErrorMessage(t('loginSection.validations.500'));
    } finally {
      setLoading(false);
    }
  };

  const alreadyHavePin = () => {
    if (validatePhone()) {
      return;
    }

    setIsPinVisible(true);
  };

  const changePassword = () => {
    dispatch(setChangePasswordPhone(phone));
    navigation.navigate('ChangePasswordContainer');
  };

  const setScreenErrorMessage = (error: string) => {
    setLoading(false);
    Keyboard.dismiss();

    showModal({
      type: 'error',
      title: t('error'),
      description: error,
      buttons: [
        {
          id: 'close',
          title: t('close'),
          onPress: () => {
            hideModal();
          },
          variant: 'secondary',
        },
      ],
      onClose: () => {},
    });
  };

  return (
    <ScreenWithKeyboard
      centerContent
      isExternal
      FooterComponent={
        <MegaText styles={{ textAlign: 'center', color: '#C5C5C5' }}>
          {t('copyright')}
        </MegaText>
      }
    >
      <View style={styles.titleContainer}>
        <MegaText
          styles={{
            textAlign: 'center',
            lineHeight: 27,
            color: Colors.primary,
          }}
          size={20}
          font={FontType.medium}
        >
          {t('loginSection.recoverPassword')}
        </MegaText>
      </View>

      <View style={styles.subtitleContainer}>
        <MegaText styles={{ textAlign: 'center' }}>
          {t('loginSection.recoverPasswordDescription')}
        </MegaText>
      </View>

      <View style={{ marginBottom: 0 }}>
        <MegaInput
          label={t('phoneNumber')}
          nativeProps={{ keyboardType: 'phone-pad', onBlur: validatePhone }}
          iconRight={<SVGs.PhoneIcon width={23} />}
          errorMessage={phoneHasError}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={{ flexDirection: 'column' }}>
        <TouchableWithoutFeedback onPress={() => setSelectedMethod('sms')}>
          <View
            style={[
              styles.radioContainer,
              selectedMethod === 'sms'
                ? styles.radioContainerActive
                : undefined,
            ]}
          >
            <View style={{ marginRight: 10 }}>
              <MegaGradient styles={{ padding: 10, borderRadius: 10 }}>
                <SVGs.SmsIcon width={23} height={23} />
              </MegaGradient>
            </View>
            <View style={{ flexGrow: 1 }}>
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ lineHeight: 24 }}
              >
                {t('accountSection.smsMessage')}
              </MegaText>
            </View>
            <View>
              <MegaRadio
                options={[{ id: 'sms', value: '' }]}
                selectedId={selectedMethod}
                onPress={() => {
                  setSelectedMethod('sms');
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => setSelectedMethod('call')}>
          <View
            style={[
              styles.radioContainer,
              selectedMethod === 'call'
                ? styles.radioContainerActive
                : undefined,
            ]}
          >
            <View style={{ marginRight: 10 }}>
              <MegaGradient styles={{ padding: 10, borderRadius: 10 }}>
                <SVGs.PhoneCallIcon width={23} height={23} />
              </MegaGradient>
            </View>
            <View style={{ flexGrow: 1 }}>
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ lineHeight: 24 }}
              >
                {t('accountSection.phoneCall')}
              </MegaText>
            </View>
            <View>
              <MegaRadio
                options={[{ id: 'call', value: '' }]}
                selectedId={selectedMethod}
                onPress={() => {
                  setSelectedMethod('call');
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View>
        <MegaButton
          text={t('accountSection.sentPin')}
          variant="secondary"
          onPress={submitForm}
          containerStyles={{ marginTop: 30 }}
        />

        <MegaButton
          text={t('accountSection.alreadyHavePin')}
          variant="light-secondary"
          onPress={alreadyHavePin}
          containerStyles={{ marginTop: 16 }}
        />
      </View>

      <PinModal
        isVisible={isPinVisible}
        phone={phone}
        formattedPhone={phone}
        onClose={(isValid: boolean) => {
          setIsPinVisible(false);
          isValid && changePassword();
        }}
      />
    </ScreenWithKeyboard>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 17,
  },
  subtitleContainer: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 33,
    paddingHorizontal: 20,
  },
  radioContainer: {
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  radioContainerActive: {
    borderWidth: 2,
    borderColor: Colors.darkGreen,
  },
});
