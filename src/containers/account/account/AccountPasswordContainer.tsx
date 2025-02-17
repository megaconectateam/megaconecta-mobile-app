import { yupResolver } from '@hookform/resolvers/yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import {
  FontType,
  MegaButton,
  MegaPassword,
  MegaText,
  ScreenWithKeyboard,
} from '../../../components/ui';
import {
  AccountPasswordSchemaType,
  accountPasswordSchema,
} from '../../../models/validations';
import { RootStackParamList } from '../../../navigation';
import { useGlobalModalContext, useLoadingContext } from '../../../providers';
import { AccountServices } from '../../../services';
import { Colors } from '../../../themes';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AccountPasswordContainer'
>;

export const AccountPasswordContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { showModal, hideModal } = useGlobalModalContext();

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<AccountPasswordSchemaType>({
    resolver: yupResolver(accountPasswordSchema),
    mode: 'onChange',
  });

  // validate password confirmation when password changes
  const password = watch('password');
  useEffect(() => {
    if (password) {
      trigger('passwordConfirmation');
    }
  }, [password]);

  const submitForm: SubmitHandler<AccountPasswordSchemaType> = async (
    data: AccountPasswordSchemaType,
  ) => {
    if (!isValid) {
      return;
    }

    try {
      Keyboard.dismiss();
      setLoading(true);

      const response = await AccountServices.updatePassword(
        data.currentPassword,
        data.password,
      );

      if (!response) {
        setScreenErrorMessage(t('changePasswordSection.validations.default'));
      } else {
        setScreenSuccessMessage();
      }
    } catch (error) {
      setScreenErrorMessage(t('changePasswordSection.validations.default'));
    } finally {
      setLoading(false);
    }
  };

  const setScreenErrorMessage = (error: string) => {
    setLoading(false);

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

  const setScreenSuccessMessage = () => {
    setLoading(false);

    showModal({
      type: 'success-password-change',
      title: t('changePasswordSection.success.title'),
      description: t('changePasswordSection.success.description'),
      buttons: [
        {
          id: 'close',
          title: t('close'),
          onPress: () => {
            hideModal();
            navigation.goBack();
          },
          variant: 'secondary',
        },
      ],
      onClose: () => {},
    });
  };

  const footer = () => {
    return (
      <View style={{ marginTop: 20 }}>
        <MegaButton
          text={t('changePassword')}
          variant="secondary"
          onPress={handleSubmit(submitForm)}
        />
      </View>
    );
  };

  return (
    <ScreenWithKeyboard
      useBottomSafeview
      isExternal
      keepFooterComponentAnchored
      FooterComponent={footer()}
    >
      <MegaText
        size={18}
        font={FontType.medium}
        styles={{
          lineHeight: 22,
          textAlign: 'center',
          color: Colors.primary,
        }}
      >
        {t('changePasswordSection.pageTitle')}
      </MegaText>

      <View style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, value } }) => (
            <MegaPassword
              value={value}
              label={t('changePasswordSection.currentPassword')}
              onChangeText={onChange}
              errorMessage={t(errors.currentPassword?.message || '')}
              nativeProps={{}}
              hasStrengthMeter={false}
            />
          )}
        />
      </View>

      <View
        style={{
          display: 'flex',
          alignContent: 'center',
          alignItems: 'center',
          marginTop: 33,
          paddingHorizontal: 0,
        }}
      >
        <MegaText size={15} styles={{ textAlign: 'center', lineHeight: 20 }}>
          {t('changePasswordSection.pageDescription')}
        </MegaText>
      </View>

      <View style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <MegaPassword
              value={value}
              label={t('password')}
              onChangeText={onChange}
              errorMessage={t(errors.password?.message || '')}
              nativeProps={{}}
              hasStrengthMeter
            />
          )}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="passwordConfirmation"
          render={({ field: { onChange, value } }) => (
            <MegaPassword
              value={value}
              label={t('repeatPass')}
              onChangeText={onChange}
              errorMessage={t(errors.passwordConfirmation?.message || '')}
              nativeProps={{}}
            />
          )}
        />
      </View>
    </ScreenWithKeyboard>
  );
};
