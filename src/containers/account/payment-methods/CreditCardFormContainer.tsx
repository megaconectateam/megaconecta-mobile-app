import { yupResolver } from '@hookform/resolvers/yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import creditCardType from 'credit-card-type';
import { CreditCardType } from 'credit-card-type/dist/types';
import { toLower } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useQuery } from 'react-query';
import { SVGs } from '../../../assets/svg';
import { CountrySelectorInput, ReportPaymentIcon } from '../../../components';
import {
  MegaButton,
  MegaInput,
  MegaMaskedInput,
  MegaText,
  ScreenWithKeyboard,
} from '../../../components/ui';
import { GenericList, QueryTypes } from '../../../models';
import { ReportPaymentMethodsEnum } from '../../../models/enums';
import { newCardSchema, newCardSchemaType } from '../../../models/validations';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { useLoadingContext } from '../../../providers';
import { ProfileContext } from '../../../providers/ProfileProvider';
import { CountryServices } from '../../../services';
import {
  convertAuthCountryToGenericList,
  creditCardExpirationMask,
  creditCardMasks,
} from '../../../utils';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'CreditCardFormContainer'
>;

export const CreditCardFormContainer = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { profile } = useContext(ProfileContext);
  const { setLoading } = useLoadingContext();

  const existingCard = route.params?.existingCard;
  const isNew = !existingCard;

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
    setValue,
  } = useForm<newCardSchemaType>({
    resolver: yupResolver(newCardSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: profile?.user.firstName || '',
      lastName: profile?.user.lastName || '',
      address1: profile?.user.address.address1 || '',
      city: profile?.user.address.city || '',
      state: profile?.user.address.state || '',
      zip: profile?.user.address.zip || '',
    },
  });

  const cardNumber = watch('cardNumber');
  const selectedCountry = watch('country');

  const [cardType, setCardType] = useState<ReportPaymentMethodsEnum>(
    ReportPaymentMethodsEnum.credit_card,
  );
  const [countryList, setCountryList] = useState<GenericList[]>([]);

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
    if (countryQuery.data?.length) {
      const userCountry = toLower(profile?.user.address.country);

      const userDefaultCountry = countryQuery.data.find(
        (i) => i.count_cod?.toLowerCase() === userCountry,
      );

      setValue(
        'country',
        convertAuthCountryToGenericList(
          userDefaultCountry || countryQuery.data[0],
        ),
      );
      setCountryList(countryQuery.data.map(convertAuthCountryToGenericList));
    }
  }, [countryQuery.data]);

  useEffect(() => {
    if (cardNumber) {
      const types: CreditCardType[] = creditCardType(cardNumber);
      if (types && types.length === 1) {
        switch (types[0].type) {
          case 'visa':
            setCardType(ReportPaymentMethodsEnum.visa);
            break;
          case 'mastercard':
            setCardType(ReportPaymentMethodsEnum.mastercard);
            break;
          case 'american-express':
            setCardType(ReportPaymentMethodsEnum.amex);
            break;
          case 'discover':
          case 'diners-club':
          case 'jcb':
          case 'unionpay':
            setCardType(ReportPaymentMethodsEnum.discover);
            break;
          default:
            setCardType(ReportPaymentMethodsEnum.credit_card);
            break;
        }
      } else {
        setCardType(ReportPaymentMethodsEnum.credit_card);
      }
    }
  }, [cardNumber]);

  const FooterComponent = () => {
    return (
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 10,
          }}
        >
          <SVGs.PadLockIcon
            width={16}
            height={16}
            style={{ marginRight: 5, marginTop: 2 }}
          />
          <MegaText size={13} styles={{ lineHeight: 20, color: '#8F979F' }}>
            {t('paymentMethodsSection.cardSaveSecure')}
          </MegaText>
        </View>

        <MegaButton
          text={t('paymentMethodsSection.saveCard')}
          variant="secondary"
          onPress={() => {}}
        />
      </View>
    );
  };

  return (
    <ScreenWithKeyboard
      useBottomSafeview
      footerWithTopBorder
      FooterComponent={FooterComponent()}
    >
      <View style={{ marginBottom: 20 }}>
        <Controller
          control={control}
          name="cardNumber"
          render={({ field: { onChange, value } }) => (
            <MegaMaskedInput
              nativeProps={{
                keyboardType: 'number-pad',
                autoComplete: 'cc-number',
                mask: () => {
                  if (cardType === ReportPaymentMethodsEnum.amex) {
                    return creditCardMasks.amex;
                  }

                  return creditCardMasks.visa;
                },
                placeholder: t('paymentMethodsSection.fields.cardNumber'),
              }}
              value={value}
              onChangeText={(_, unmaskedText) => onChange(unmaskedText)}
              errorMessage={t(errors.cardNumber?.message || '')}
              iconRight={
                <ReportPaymentIcon paymentMethod={cardType} opacity={0.8} />
              }
            />
          )}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="cardExpiration"
            render={({ field: { onChange, value } }) => (
              <MegaMaskedInput
                nativeProps={{
                  keyboardType: 'number-pad',
                  autoComplete: 'cc-exp',
                  mask: creditCardExpirationMask,
                  placeholder: t('paymentMethodsSection.fields.expirationDate'),
                }}
                value={value}
                onChangeText={(_, unmaskedText) => onChange(unmaskedText)}
                errorMessage={t(errors.cardExpiration?.message || '')}
              />
            )}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="cardCvc"
            render={({ field: { onChange, value } }) => (
              <MegaMaskedInput
                nativeProps={{
                  keyboardType: 'number-pad',
                  autoComplete: 'cc-csc',
                  mask: () => {
                    if (cardType === ReportPaymentMethodsEnum.amex) {
                      return [/\d/, /\d/, /\d/, /\d/];
                    }

                    return [/\d/, /\d/, /\d/];
                  },
                  placeholder: t('paymentMethodsSection.fields.cvc'),
                }}
                value={value}
                onChangeText={(_, unmaskedText) => onChange(unmaskedText)}
                errorMessage={t(errors.cardCvc?.message || '')}
              />
            )}
          />
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              value={value}
              errorMessage={t(errors.firstName?.message || '')}
              nativeProps={{
                keyboardType: 'default',
                placeholder: t('firstName'),
              }}
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
              errorMessage={t(errors.lastName?.message || '')}
              nativeProps={{
                keyboardType: 'default',
                placeholder: t('lastName'),
              }}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, value } }) => (
            <CountrySelectorInput
              countryList={countryList}
              selectedCountry={value?.value}
              onSelectCountry={onChange}
              labelBackgroundColor="transparent"
              hasShadow
            />
          )}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Controller
          control={control}
          name="address1"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              value={value}
              errorMessage={t(errors.address1?.message || '')}
              nativeProps={{
                keyboardType: 'default',
                placeholder: t('address'),
                autoCorrect: false,
              }}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              value={value}
              errorMessage={t(errors.city?.message || '')}
              nativeProps={{
                keyboardType: 'default',
                placeholder: t('city'),
                autoCorrect: false,
              }}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, value } }) => (
            <MegaInput
              value={value}
              errorMessage={t(errors.state?.message || '')}
              nativeProps={{
                keyboardType: 'default',
                placeholder: t('state'),
                autoCorrect: false,
              }}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={{ marginBottom: 20, maxWidth: '50%' }}>
        <Controller
          control={control}
          name="zip"
          render={({ field: { onChange, value } }) => (
            <MegaInput
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
              onChangeText={onChange}
            />
          )}
        />
      </View>
    </ScreenWithKeyboard>
  );
};
