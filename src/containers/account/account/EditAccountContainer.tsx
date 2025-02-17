import { yupResolver } from '@hookform/resolvers/yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { toLower } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import { useQuery } from 'react-query';
import { CountrySelectorInput } from '../../../components';
import {
  FontType,
  MegaButton,
  MegaCard,
  MegaInput,
  MegaText,
  ScreenWithKeyboard,
} from '../../../components/ui';
import { GenericList, QueryTypes } from '../../../models';
import { ProfileSchemaType, profileSchema } from '../../../models/validations';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { useGlobalModalContext, useLoadingContext } from '../../../providers';
import { ProfileContext } from '../../../providers/ProfileProvider';
import { AccountServices, CountryServices } from '../../../services';
import { Colors } from '../../../themes';
import { convertAuthCountryToGenericList } from '../../../utils';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'EditAccountContainer'
>;

export const EditAccountContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { profile, refetchProfile } = useContext(ProfileContext);
  const { showModal, hideModal } = useGlobalModalContext();

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProfileSchemaType>({
    resolver: yupResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      address1: profile?.user.address.address1 || '',
      city: profile?.user.address.city || '',
      state: profile?.user.address.state || '',
      zip: profile?.user.address.zip || '',
    },
  });

  const selectedCountry = watch('country');
  const [countryList, setCountryList] = useState<GenericList[]>([]);

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
    if (countryQuery.data?.length) {
      const usa = countryQuery.data.find(
        (i) =>
          i.count_cod?.toLowerCase() === toLower(profile?.user.address.country),
      );

      setValue(
        'country',
        convertAuthCountryToGenericList(usa || countryQuery.data[0]),
      );
      setCountryList(countryQuery.data.map(convertAuthCountryToGenericList));
    }
  }, [countryQuery.data]);

  const submitForm: SubmitHandler<ProfileSchemaType> = async (
    data: ProfileSchemaType,
  ) => {
    Keyboard.dismiss();
    if (!isValid) {
      trigger();
      return;
    }

    try {
      setLoading(true);
      const response = await AccountServices.updateProfile({
        country: profile?.user.address.country,
        email: profile?.user.email,
        firstName: profile?.user.firstName,
        lastName: profile?.user.lastName,
        receiveEmail: profile?.user.receive_emails || false,
        receiveSms: profile?.user.receive_sms || false,
        address1: data.address1,
        city: data.city,
        state: data.state,
        zipCode: data.zip,
      });

      if (!response) {
        setScreenErrorMessage();
      } else {
        refetchProfile();
        navigation.goBack();
      }
    } catch (error) {
      setScreenErrorMessage();
    } finally {
      setLoading(false);
    }
  };

  const setScreenErrorMessage = () => {
    setLoading(false);
    Keyboard.dismiss();

    showModal({
      type: 'error',
      title: t('error'),
      description: t('no_expected_error_try_again'),
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

  const FooterComponent = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <MegaButton
          text={t('save')}
          variant="secondary"
          onPress={handleSubmit(submitForm)}
        />
      </View>
    );
  };

  return (
    <ScreenWithKeyboard
      useBottomSafeview
      FooterComponent={FooterComponent()}
      footerWithTopBorder
      keepFooterComponentAnchored
    >
      <MegaCard>
        <MegaText
          size={18}
          font={FontType.medium}
          styles={{ lineHeight: 21, color: Colors.primary }}
        >
          {t('personalData')}
        </MegaText>

        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <MegaText size={13} styles={{ lineHeight: 27 }}>
            {`${t('firstName')}: `}
          </MegaText>
          <MegaText
            size={13}
            styles={{ lineHeight: 27, color: Colors.primary }}
            font={FontType.medium}
          >
            {`${profile?.user?.firstName}`}
          </MegaText>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <MegaText size={13} styles={{ lineHeight: 27 }}>
            {`${t('lastName')}: `}
          </MegaText>
          <MegaText
            size={13}
            styles={{ lineHeight: 27, color: Colors.primary }}
            font={FontType.medium}
          >
            {`${profile?.user?.lastName}`}
          </MegaText>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <MegaText size={13} styles={{ lineHeight: 27 }}>
            {`${t('email')}: `}
          </MegaText>
          <MegaText
            size={13}
            styles={{ lineHeight: 27, color: Colors.primary }}
            font={FontType.medium}
          >
            {`${profile?.user?.email}`}
          </MegaText>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <MegaText size={13} styles={{ lineHeight: 27 }}>
            {`${t('phone')}: `}
          </MegaText>
          <MegaText
            size={13}
            styles={{ lineHeight: 27, color: Colors.primary }}
            font={FontType.medium}
          >
            {`${profile?.user?.phone}`}
          </MegaText>
        </View>
      </MegaCard>

      <MegaText
        size={18}
        font={FontType.medium}
        styles={{ lineHeight: 21, color: Colors.primary, marginTop: 20 }}
      >
        {t('address')}
      </MegaText>

      <View style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, value } }) => (
            <CountrySelectorInput
              countryList={countryList}
              selectedCountry={value?.value}
              onSelectCountry={onChange}
              labelBackgroundColor="transparent"
              hasShadow={false}
              isDisabled
            />
          )}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="address1"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              value={value}
              label={t('address')}
              errorMessage={t(errors.address1?.message || '')}
              nativeProps={{
                keyboardType: 'default',
                placeholder: t('address'),
                autoCorrect: false,
              }}
              isLabelTransparent
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              label={t('city')}
              value={value}
              errorMessage={t(errors.city?.message || '')}
              nativeProps={{
                keyboardType: 'default',
                placeholder: t('city'),
                autoCorrect: false,
              }}
              isLabelTransparent
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              label={t('state')}
              value={value}
              errorMessage={t(errors.state?.message || '')}
              nativeProps={{
                keyboardType: 'default',
                placeholder: t('state'),
                autoCorrect: false,
              }}
              isLabelTransparent
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={{ marginVertical: 20, maxWidth: '50%' }}>
        <Controller
          control={control}
          name="zip"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              label={t('zip')}
              value={value}
              errorMessage={t(errors.zip?.message || '')}
              nativeProps={{
                keyboardType:
                  toLower(selectedCountry?.value) === 'us'
                    ? 'number-pad'
                    : 'default',
                placeholder: t('zip'),
                autoCorrect: false,
              }}
              isLabelTransparent
              onChangeText={onChange}
            />
          )}
        />
      </View>
    </ScreenWithKeyboard>
  );
};
