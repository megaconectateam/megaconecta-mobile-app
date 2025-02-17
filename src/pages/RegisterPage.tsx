import { yupResolver } from '@hookform/resolvers/yup';
import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useQuery } from 'react-query';
import { SVGs } from '../assets/svg';
import { CountrySelectorInput } from '../components';
import {
  FontType,
  MegaButton,
  MegaInput,
  MegaMaskedInput,
  MegaText,
} from '../components/ui';
import { GenericList, QueryTypes } from '../models';
import { AccountSchemaType, accountSchema } from '../models/validations';
import { useGlobalModalContext, useLoadingContext } from '../providers';
import { CountryServices, RegisterService } from '../services';
import { setRegisterUser } from '../store/features/registerSlice';
import { useAppDispatch } from '../store/hooks';
import { Colors } from '../themes';
import { convertAuthCountryToGenericList, getMaskByCountry } from '../utils';

export type RegisterPageProps = {
  onContinue: () => void;
};

export const RegisterPage = ({ onContinue }: RegisterPageProps) => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { showModal, hideModal } = useGlobalModalContext();
  const dispatch = useAppDispatch();

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<AccountSchemaType>({
    resolver: yupResolver(accountSchema),
    mode: 'onChange',
    defaultValues: {
      promoSms: true,
    },
  });

  const [selectedCountry, setSelectedCountry] = useState<GenericList | null>(
    null,
  );
  const [countryList, setCountryList] = useState<GenericList[]>([]);
  const [phone, setPhone] = useState<string>('');
  const [phoneHasError, setPhoneHasError] = useState<string>('');
  const [passwordSecureEntry, setPasswordSecureEntry] = useState<boolean>(true);
  const [confirmPasswordSecureEntry, setConfirmPasswordSecureEntry] =
    useState<boolean>(true);

  const countryQuery = useQuery(
    QueryTypes.GetAuthCountries,
    () => {
      setLoading(true);
      return CountryServices.getAllAuthorizedCountries();
    },
    {
      onSettled: () => {
        setLoading(false);
      },
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

  const getMask = () => {
    const mask = countryQuery?.data?.find(
      (c) => c.count_cod.toLowerCase() === selectedCountry?.value.toLowerCase(),
    )?.phone_mask;

    if (mask) {
      return getMaskByCountry(mask);
    }

    return [];
  };

  const onPhoneChange = (maskedText: string, unmaskedText: string) => {
    setPhone(unmaskedText);

    if (!unmaskedText) {
      setPhoneHasError(t('accountSection.validations.phoneRequired'));
      return;
    }

    if (getMask().length !== maskedText.length) {
      setPhoneHasError(t('phoneLoginWrongFormat'));
    } else {
      setPhoneHasError('');
    }
  };

  // validate password confirmation when password changes
  const password = watch('password');
  useEffect(() => {
    if (password) {
      trigger('passwordConfirmation');
    }
  }, [password]);

  const submitForm: SubmitHandler<AccountSchemaType> = async (
    data: AccountSchemaType,
  ) => {
    if (!selectedCountry) {
      return;
    }

    if (!phone) {
      return;
    }

    setLoading(true);
    const response: { success: boolean; code: string } =
      await RegisterService.preRegister(
        data.email,
        phone,
        selectedCountry.value,
      );

    if (!response.success) {
      dispatch(setRegisterUser(null));

      let registerMessage = t('accountSection.registerErrors.default');
      switch (response.code) {
        case '003':
          registerMessage = `${t(
            'accountSection.registerErrors.003',
          )} ${registerMessage}`;
          break;

        case '004':
          registerMessage = `${t(
            'accountSection.registerErrors.004',
          )} ${registerMessage}`;
          break;

        case '005':
          registerMessage = t('accountSection.registerErrors.005');
          break;

        case '006':
          registerMessage = t('accountSection.registerErrors.006');
          break;

        case '500':
        default:
          registerMessage = t('accountSection.registerErrors.500');
          break;
      }

      setScreenErrorMessage(registerMessage);
      return;
    }

    setLoading(false);

    dispatch(
      setRegisterUser({
        selectedCountry,
        phone,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        promoSms: !!data.promoSms,
      }),
    );
    onContinue();
  };

  const onSubmitWithError = () => {
    if (!phone) {
      setPhoneHasError(t('accountSection.validations.phoneRequired'));
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

  return (
    <View>
      <View style={styles.subtitleContainer}>
        <MegaText styles={{ textAlign: 'center' }}>
          {t('create_account_title')}
        </MegaText>
      </View>
      <View style={styles.headerContainer}>
        <MegaText size={18} font={FontType.bold}>
          {t('personalData')}
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
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              value={value}
              label={t('firstName')}
              errorMessage={t(errors.firstName?.message || '')}
              nativeProps={{ keyboardType: 'default' }}
              onChangeText={onChange}
            />
          )}
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              value={value}
              label={t('lastName')}
              errorMessage={t(errors.lastName?.message || '')}
              nativeProps={{ keyboardType: 'default' }}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <MegaMaskedInput
          label={t('phoneNumber')}
          nativeProps={{ keyboardType: 'phone-pad', mask: getMask() }}
          value={phone}
          onChangeText={onPhoneChange}
          errorMessage={phoneHasError}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              value={value}
              label={t('email')}
              errorMessage={t(errors.email?.message || '')}
              nativeProps={{ keyboardType: 'email-address' }}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={styles.headerContainer}>
        <MegaText size={18} font={FontType.bold}>
          {t('security')}
        </MegaText>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              label={t('password')}
              nativeProps={{
                secureTextEntry: passwordSecureEntry,
              }}
              value={value}
              iconRight={
                <TouchableOpacity
                  onPress={() => setPasswordSecureEntry(!passwordSecureEntry)}
                >
                  <SVGs.PasswordEye width={23} />
                </TouchableOpacity>
              }
              errorMessage={t(errors.password?.message || '')}
              onChangeText={onChange}
            />
          )}
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <Controller
          control={control}
          name="passwordConfirmation"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              label={t('repeatPass')}
              nativeProps={{
                secureTextEntry: confirmPasswordSecureEntry,
              }}
              value={value}
              iconRight={
                <TouchableOpacity
                  onPress={() =>
                    setConfirmPasswordSecureEntry(!confirmPasswordSecureEntry)
                  }
                >
                  <SVGs.PasswordEye width={23} />
                </TouchableOpacity>
              }
              errorMessage={t(errors.passwordConfirmation?.message || '')}
              onChangeText={onChange}
            />
          )}
        />
      </View>
      <View style={{ marginBottom: 20, flexDirection: 'row' }}>
        <Controller
          control={control}
          name="promoSms"
          render={({ field: { onChange, value } }) => (
            <>
              <Checkbox
                style={{ marginRight: 10, marginTop: 5 }}
                value={!!value}
                onValueChange={onChange}
                color={value ? Colors.darkGreen : undefined}
              />
              <MegaText>
                Acepto recibir emails y SMS promocionales de Megaconecta
              </MegaText>
            </>
          )}
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <MegaText styles={{ lineHeight: 20, color: '#8F979F' }} size={13}>
          {t('disclaimer')}{' '}
          <TouchableOpacity>
            <MegaText
              styles={{
                lineHeight: 20,
                color: Colors.darkGreen,
                paddingTop: 10,
              }}
              size={15}
            >
              {t('termAndConditions')}
            </MegaText>
          </TouchableOpacity>
        </MegaText>
      </View>
      <MegaButton
        text={t('continue')}
        variant="secondary"
        onPress={handleSubmit(submitForm, onSubmitWithError)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  subtitleContainer: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 33,
    paddingHorizontal: 20,
  },

  headerContainer: {
    display: 'flex',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 33,
  },
});
