import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SVGs } from '../../assets/svg';
import {
  FontType,
  MegaButton,
  MegaInput,
  MegaText,
  ScreenWithKeyboard,
} from '../../components/ui';
import { LoginResponse } from '../../models';
import { RootStackParamList } from '../../navigation';
import { AuthContext } from '../../providers/AuthProvider';
import { useLoadingContext } from '../../providers/LoadingProvider';
import { useGlobalModalContext } from '../../providers/ModalProvider';
import { AuthService } from '../../services';
import { Colors } from '../../themes';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginContainer = ({ navigation }: Props) => {
  const authCxt = useContext(AuthContext);

  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { width } = useWindowDimensions();

  const [phone, setPhone] = useState<string>('');
  const [phoneHasError, setPhoneHasError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordHasError, setPasswordHasError] = useState<string>('');
  const [passwordSecureEntry, setPasswordSecureEntry] = useState<boolean>(true);
  const [token, setToken] = useState<string>('');
  const { showModal, hideModal } = useGlobalModalContext();

  const goToLoginWithSms = () => {
    navigation.navigate('LoginSms');
  };

  const goToCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  const submitForm = async () => {
    Keyboard.dismiss();

    if (!phone) {
      setPhoneHasError(t('phoneRequired'));
      return;
    }

    if (!password) {
      setPasswordHasError(t('passwordRequired'));
      return;
    }

    setPhoneHasError('');
    setPasswordHasError('');

    try {
      setLoading(true, { title: t('validatingAccount') });

      const response: LoginResponse = await AuthService.login(
        phone,
        password,
        token,
      );

      if (response.success && response.token) {
        const success = await authCxt.setToken(response.token);
        if (!success) {
          throw new Error(`Couldn't store the user token`);
        }

        await getUserInfo();
      } else {
        showModal({
          title: t('error'),
          onClose: () => {},
          type: 'error',
          description: t(response.error || 'loginError'),
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
        });
      }
    } catch (error) {
      showModal({
        title: t('error'),
        onClose: () => {},
        type: 'error',
        description: t('loginError'),
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
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setToken('');
  }, []);

  const getUserInfo = async () => {
    const user = await AuthService.getUser();

    if (user) {
      const success = await authCxt.setUser(user);

      if (!success) {
        throw new Error(`Couldn't store the user data`);
      }
    }
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
      <View
        style={[
          styles.logoContainer,
          width <= 380 && styles.logoContainerSmall,
        ]}
      >
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
          {t('loginPassSubtitle')}
        </MegaText>
      </View>

      <View style={{ marginBottom: 20 }}>
        <MegaInput
          label={t('phoneNumber')}
          nativeProps={{ keyboardType: 'phone-pad' }}
          iconRight={<SVGs.PhoneIcon width={23} />}
          errorMessage={phoneHasError}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <MegaInput
          label={t('password')}
          nativeProps={{
            secureTextEntry: passwordSecureEntry,
            keyboardType: passwordSecureEntry ? 'default' : 'visible-password',
          }}
          value={password}
          iconRight={
            <TouchableOpacity
              onPress={() => setPasswordSecureEntry(!passwordSecureEntry)}
            >
              <SVGs.PasswordEye width={23} />
            </TouchableOpacity>
          }
          errorMessage={passwordHasError}
          onChangeText={setPassword}
        />
      </View>

      <View style={{ marginBottom: 20, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordContainer')}
        >
          <MegaText styles={{ color: Colors.darkGreen, marginTop: 5 }}>
            {t('forgotPassLink')}
          </MegaText>
        </TouchableOpacity>
      </View>

      <MegaButton
        text={t('loginTitle')}
        variant="secondary"
        onPress={() => {
          submitForm();
        }}
      />

      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <View style={styles.orContainer}>
          <MegaText>{t('or')}</MegaText>
        </View>
      </View>

      <MegaButton
        text={t('accessWithSms')}
        variant="light-secondary"
        onPress={goToLoginWithSms}
        containerStyles={{ marginBottom: 10 }}
      />

      <MegaButton
        text={t('createAccount')}
        variant="light-secondary"
        onPress={goToCreateAccount}
      />

      <SafeAreaView style={styles.spacing} />
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
  logoContainerSmall: {
    marginTop: 30,
    marginBottom: 10,
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

  spacing: {
    backgroundColor: Colors.white,
    minHeight: 16,
  },
});
