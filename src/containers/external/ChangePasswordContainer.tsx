import { yupResolver } from '@hookform/resolvers/yup';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, View } from 'react-native';
import {
  FontType,
  MegaButton,
  MegaPassword,
  MegaText,
  ScreenWithKeyboard,
} from '../../components/ui';
import {
  ChangePasswordSchemaType,
  changePasswordSchema,
} from '../../models/validations';
import { RootStackParamList } from '../../navigation';
import { useGlobalModalContext, useLoadingContext } from '../../providers';
import { RegisterService } from '../../services';
import { selectChangePasswordPhone } from '../../store/features/registerSlice';
import { useAppSelector } from '../../store/hooks';
import { Colors } from '../../themes';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ChangePasswordContainer'
>;

export const ChangePasswordContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { showModal, hideModal } = useGlobalModalContext();
  const phone = useAppSelector(selectChangePasswordPhone);

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onChange',
  });

  // validate password confirmation when password changes
  const password = watch('password');
  useEffect(() => {
    if (password) {
      trigger('passwordConfirmation');
    }
  }, [password]);

  const submitForm: SubmitHandler<ChangePasswordSchemaType> = async (
    data: ChangePasswordSchemaType,
  ) => {
    try {
      Keyboard.dismiss();
      setLoading(true);

      const response = await RegisterService.changePassword(
        phone,
        data.password,
      );

      if (!response.success) {
        switch (response.code) {
          case '003':
            setScreenErrorMessage(t('changePasswordSection.validations.003'));
            break;

          case '002':
          case '004':
          case '500':
          default:
            setScreenErrorMessage(
              t('changePasswordSection.validations.default'),
            );
            break;
        }
        return;
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }),
      );
    } catch (error) {
      setScreenErrorMessage(t('changePasswordSection.validations.default'));
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
          {t('changePasswordSection.pageTitle')}
        </MegaText>
      </View>

      <View style={styles.subtitleContainer}>
        <MegaText size={15} styles={{ textAlign: 'center', lineHeight: 20 }}>
          {t('changePasswordSection.pageDescription')}
        </MegaText>
      </View>

      <View>
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
              hasStrengthMeter={false}
            />
          )}
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <MegaButton
          text={t('changePassword')}
          variant="secondary"
          onPress={handleSubmit(submitForm)}
        />
      </View>
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
    paddingHorizontal: 0,
  },
});
