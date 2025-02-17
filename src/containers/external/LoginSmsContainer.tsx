import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useQuery } from 'react-query';

import { SVGs } from '../../assets/svg';
import { CountrySelectorInput } from '../../components';
import {
  FontType,
  MegaButton,
  MegaMaskedInput,
  MegaText,
  ScreenWithKeyboard,
} from '../../components/ui';
import { GenericList, GenericResponse, QueryTypes } from '../../models';
import { RootStackParamList } from '../../navigation';
import { useLoadingContext } from '../../providers/LoadingProvider';
import { useGlobalModalContext } from '../../providers/ModalProvider';
import { AuthService, CountryServices } from '../../services';
import { Colors } from '../../themes';
import { convertAuthCountryToGenericList, getMaskByCountry } from '../../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'LoginSms'>;

export const LoginSmsContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { showModal, hideModal } = useGlobalModalContext();

  const [selectedCountry, setSelectedCountry] = useState<GenericList | null>(
    null,
  );
  const [countryList, setCountryList] = useState<GenericList[]>([]);
  const [phone, setPhone] = useState<{ masked: string; value: string }>({
    masked: '',
    value: '',
  });
  const [phoneHasError, setPhoneHasError] = useState<string>('');

  const countryQuery = useQuery(
    QueryTypes.GetAuthCountries,
    () => {
      setLoading(true);
      return CountryServices.getAllAuthorizedCountries();
    },
    {
      onSettled: () => setLoading(false),
    },
  );

  useEffect(() => {
    if (countryQuery.data?.length && !selectedCountry) {
      const usa = countryQuery.data.find(
        (i) => i.count_cod?.toLowerCase() === 'us',
      );

      setSelectedCountry(
        convertAuthCountryToGenericList(usa || countryQuery.data[0]),
      );

      setCountryList(countryQuery.data.map(convertAuthCountryToGenericList));
    }
  }, [countryQuery.data]);

  const showError = () => {
    showModal({
      type: 'error',
      title: t('error'),
      description: t('no_expected_error_try_again'),
      onClose: () => {},
      buttons: [
        {
          id: 'c',
          title: t('close'),
          onPress: () => {
            hideModal();
          },
          variant: 'secondary',
        },
      ],
    });
  };

  const getMask = () => {
    const mask = countryQuery?.data?.find(
      (c) => c.count_cod.toLowerCase() === selectedCountry?.value.toLowerCase(),
    )?.phone_mask;

    if (mask) {
      return getMaskByCountry(mask);
    }

    return [];
  };

  const goToVerification = () => {
    navigation.navigate('SmsVerification', {
      phone: phone.value,
      country: (selectedCountry?.value || '').toUpperCase(),
    });
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const goToCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  const onPhoneChange = (maskedText: string, unmaskedText: string) => {
    setPhone({
      masked: maskedText,
      value: unmaskedText,
    });

    verifyPhone(maskedText);
  };

  const verifyPhone = (maskedText: string) => {
    if (getMask().length !== maskedText.length) {
      setPhoneHasError(t('phoneLoginWrongFormat'));
      return false;
    }

    setPhoneHasError('');
    return true;
  };

  const submitForm = async () => {
    Keyboard.dismiss();
    if (phoneHasError || !selectedCountry || !verifyPhone(phone.masked)) {
      return;
    }

    try {
      setLoading(true);
      const response: GenericResponse = await AuthService.requestOtpLogin(
        phone.value,
        selectedCountry.value.toUpperCase(),
      );

      setLoading(false);
      if (response.success) {
        goToVerification();
        return;
      }

      showError();
    } catch (error) {
      setLoading(false);
      console.log(error);
      showError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWithKeyboard
      isExternal
      centerContent
      FooterComponent={
        <MegaText styles={{ textAlign: 'center', color: '#C5C5C5' }}>
          {t('copyright')}
        </MegaText>
      }
      useBottomSafeview
      keepFooterComponentAnchored
    >
      <View style={styles.logoContainer}>
        <SVGs.LogoColored width={220} />
      </View>

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
          {t('loginTitle')}
        </MegaText>
      </View>

      <View style={styles.subtitleContainer}>
        <MegaText styles={{ textAlign: 'center' }}>
          {t('loginSubtitle')}
        </MegaText>
      </View>

      <View style={{ marginBottom: 20 }}>
        <CountrySelectorInput
          countryList={countryList}
          selectedCountry={selectedCountry?.value}
          onSelectCountry={(c: GenericList) => {
            setSelectedCountry(c);
          }}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <MegaMaskedInput
          label={t('phoneNumber')}
          nativeProps={{ keyboardType: 'phone-pad', mask: getMask() }}
          iconRight={<SVGs.PhoneIcon width={23} />}
          value={phone.value}
          onChangeText={onPhoneChange}
          errorMessage={phoneHasError}
        />
      </View>

      <MegaButton
        text={t('sendSms')}
        variant="secondary"
        onPress={submitForm}
      />

      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <View style={styles.orContainer}>
          <MegaText>{t('or')}</MegaText>
        </View>
      </View>

      <MegaButton
        text={t('accessWithPassword')}
        variant="light-secondary"
        onPress={goToLogin}
        containerStyles={{ marginBottom: 10 }}
      />

      <MegaButton
        text={t('createAccount')}
        variant="light-secondary"
        onPress={goToCreateAccount}
      />
    </ScreenWithKeyboard>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 33,
  },

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

  lineContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 25,
  },

  line: {
    borderBottomColor: '#C5C5C5',
    borderBottomWidth: 1,
    opacity: 0.5,
    width: '85%',
    height: 2,
  },

  orContainer: {
    position: 'absolute',
    left: '49%',
    top: 16,
    backgroundColor: Colors.white,
    paddingHorizontal: 5,
  },
});
