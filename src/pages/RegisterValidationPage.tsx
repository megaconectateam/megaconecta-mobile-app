import { CommonActions, useNavigation } from '@react-navigation/native';
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js';
import { toLower, toUpper } from 'lodash';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SVGs } from '../assets/svg';
import { PinModal } from '../components';
import {
  FontType,
  MegaButton,
  MegaGradient,
  MegaRadio,
  MegaText,
} from '../components/ui';
import {
  AuthContext,
  useGlobalModalContext,
  useLoadingContext,
} from '../providers';
import { AuthService, RegisterService } from '../services';
import { Selectors } from '../store/features';
import { useAppSelector } from '../store/hooks';
import { Colors } from '../themes';

export const RegisterValidationPage = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { showModal, hideModal } = useGlobalModalContext();
  const navigation = useNavigation();
  const authCxt = useContext(AuthContext);

  const registerUser = useAppSelector(Selectors.selectRegisterUser);

  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'call'>('sms');
  const [isPinVisible, setIsPinVisible] = useState<boolean>(false);

  if (!registerUser) {
    return null;
  }

  const phone = parsePhoneNumber(
    registerUser.phone,
    toUpper(registerUser.selectedCountry.value) as CountryCode,
  );

  const sendPin = async () => {
    try {
      setLoading(true);

      const response = await RegisterService.requestPinValidation(
        selectedMethod,
        registerUser.phone,
        registerUser.selectedCountry.value,
      );

      if (!response.success) {
        if (response.code === '002') {
          setScreenErrorMessage(
            t('accountSection.pinValidationErrors.alreadyHavePin'),
          );
        } else {
          setScreenErrorMessage(
            t('accountSection.pinValidationErrors.default'),
          );
        }
        return;
      }

      setIsPinVisible(true);
    } catch (error) {
      console.log(error);
      setScreenErrorMessage(t('accountSection.pinValidationErrors.default'));
    } finally {
      setLoading(false);
    }
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

  const alreadyHavePin = () => {
    setIsPinVisible(true);
  };

  const createAccount = async () => {
    try {
      setIsPinVisible(false);
      setLoading(true);

      const response = await RegisterService.createAccount(
        registerUser.email,
        registerUser.phone,
        registerUser.selectedCountry.value,
        registerUser.firstName,
        registerUser.lastName,
        registerUser.password,
        registerUser.promoSms,
      );

      if (!response.success || !response.token) {
        switch (response.code) {
          case '002':
          case '003':
          case '004':
            setScreenErrorMessage(t('accountSection.creation.accountExists'));
            break;

          case '100':
            setLoading(false);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }),
            );
            break;

          case '500':
          default:
            setScreenErrorMessage(t('accountSection.creation.default'));
            break;
        }
        return;
      }

      await authCxt.setToken(response.token);
      getUserInfo();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = async () => {
    setLoading(true);

    try {
      const user = await AuthService.getUser();

      if (user) {
        await authCxt.setUser(user);
      } else {
        throw new Error(`Couldn't get the user data`);
      }
    } catch (error) {
      console.log(error);
      setScreenErrorMessage(t('no_expected_error_try_again'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View>
        <MegaText size={15} styles={{ lineHeight: 20, textAlign: 'center' }}>
          {t('accountSection.pinRegisterMessage1')}{' '}
          <MegaText
            size={15}
            styles={{ lineHeight: 20, color: Colors.darkGreen }}
          >
            {phone?.formatInternational()}
          </MegaText>
          {'. '}
          {t('accountSection.pinRegisterMessage2')}
        </MegaText>
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

      <View style={{ marginTop: 30 }}>
        <MegaButton
          variant="secondary"
          text={t('accountSection.sentPin')}
          onPress={sendPin}
        />
        <MegaButton
          variant="light-secondary"
          text={t('accountSection.alreadyHavePin')}
          onPress={alreadyHavePin}
          containerStyles={{ marginTop: 16 }}
        />
      </View>

      <PinModal
        isVisible={isPinVisible}
        phone={registerUser.phone}
        formattedPhone={phone?.formatInternational() || ''}
        country={toLower(registerUser.selectedCountry.value)}
        onClose={(isValid: boolean) => {
          setIsPinVisible(false);
          isValid && createAccount();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
