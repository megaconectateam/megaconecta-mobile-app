import { yupResolver } from '@hookform/resolvers/yup';
import { toLower } from 'lodash';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { GenericList } from '../../models';
import {
  ReferralSchemaType,
  referralSchema,
} from '../../models/validations/referral';
import { ReferralServices } from '../../services';
import { Colors } from '../../themes';
import { getMaskByCountry } from '../../utils';
import {
  Flag,
  FontType,
  MegaButton,
  MegaErrorMsg,
  MegaInput,
  MegaMaskedInput,
  MegaModal,
  MegaRadio,
  MegaText,
} from '../ui';

export type WithdrawCommissionModalProps = {
  isVisible: boolean;
  country: GenericList;
  onClose: (refresh?: boolean) => void;
};

export const WithdrawCommissionModal = ({
  isVisible,
  onClose,
  country,
}: WithdrawCommissionModalProps) => {
  const { t } = useTranslation();

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<ReferralSchemaType>({
    resolver: yupResolver(referralSchema),
    mode: 'onChange',
    defaultValues: {
      zelleAccountType: 'phone',
    },
  });

  const zelleAccountType = watch('zelleAccountType');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getMask = () => {
    const mask = country.phoneMask;

    if (mask) {
      return getMaskByCountry(mask, true);
    }

    return [];
  };

  const submitForm: SubmitHandler<ReferralSchemaType> = async (
    data: ReferralSchemaType,
  ) => {
    try {
      if (!isValid) {
        return;
      }

      setIsLoading(true);

      const isSuccess = await ReferralServices.withdrawByZelle(
        `${data.firstName} ${data.lastName}`,
        data.zelleAccountType === 'phone' ? data.zellePhone : undefined,
        data.zelleAccountType === 'email' ? data.zelleEmail : undefined,
      );

      if (isSuccess) {
        onClose(true);
      } else {
        setErrorMessage(t('no_expected_error_try_again'));
      }
    } catch (error) {
      setErrorMessage(t('no_expected_error_try_again'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MegaModal
      isLoading={isLoading}
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
          <View
            style={{
              paddingHorizontal: 30,
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
              {t('referralSection.retrieveCommission')}
            </MegaText>
          </View>

          <View style={{ position: 'absolute', top: 4, right: 0 }}>
            <TouchableOpacity onPress={() => onClose(false)}>
              <SVGs.CloseIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <MegaText
            size={15}
            font={FontType.medium}
            styles={{
              lineHeight: 23,
              color: '#5F6368',
            }}
          >
            {t('referralSection.retrieveCommissionDescription')}
          </MegaText>
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
          <Controller
            control={control}
            name="zelleAccountType"
            render={({ field: { onChange, value } }) => (
              <View
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <MegaText
                  size={15}
                  font={FontType.medium}
                  styles={{
                    lineHeight: 23,
                    color: '#5F6368',
                  }}
                >
                  {t('referralSection.zelleAccountType') + ':'}
                </MegaText>

                <MegaRadio
                  options={[
                    {
                      id: 'phone',
                      label: 'Phone',
                      value: 'phone',
                    },
                    {
                      id: 'email',
                      label: 'Email',
                      value: 'email',
                    },
                  ]}
                  selectedId={value}
                  onPress={onChange}
                />
              </View>
            )}
          />
        </View>

        {zelleAccountType === 'phone' && (
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="zellePhone"
              render={({ field: { onChange, value } }) => (
                <MegaMaskedInput
                  label={t('phoneNumber')}
                  nativeProps={{ keyboardType: 'phone-pad', mask: getMask() }}
                  value={value}
                  onChangeText={(_, unmaskedText) => onChange(unmaskedText)}
                  errorMessage={t(errors.zellePhone?.message || '')}
                  inputStyles={{ paddingStart: 85 }}
                  iconLeft={
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingRight: 10,
                        borderRightWidth: 1,
                        borderColor: Colors.border1,
                      }}
                    >
                      <Flag
                        name={toLower(country.value)}
                        styles={{ marginRight: 8 }}
                      />

                      <MegaText size={16} styles={{ lineHeight: 25 }}>
                        {country.extraLabel}
                      </MegaText>
                    </View>
                  }
                />
              )}
            />
          </View>
        )}

        {zelleAccountType === 'email' && (
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="zelleEmail"
              render={({ field: { onChange, value } }) => (
                <MegaInput
                  value={value || ''}
                  label={t('email')}
                  errorMessage={t(errors.zelleEmail?.message || '')}
                  nativeProps={{ keyboardType: 'email-address' }}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        )}

        {!!errorMessage && (
          <View style={{ marginBottom: 20 }}>
            <MegaErrorMsg message={errorMessage} />
          </View>
        )}

        <View style={{ marginBottom: 20 }}>
          <MegaButton
            text={t('referralSection.retrieve')}
            variant="secondary"
            onPress={handleSubmit(submitForm)}
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
});
