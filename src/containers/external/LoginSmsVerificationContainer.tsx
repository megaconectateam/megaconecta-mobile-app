import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { SVGs } from '../../assets/svg';
import {
  Flag,
  FontType,
  MegaButton,
  MegaText,
  ScreenWithKeyboard,
} from '../../components/ui';
import { GenericResponse, LoginResponse } from '../../models';
import { RootStackParamList } from '../../navigation';
import { useGlobalModalContext, useLoadingContext } from '../../providers';
import { AuthContext } from '../../providers/AuthProvider';
import { AuthService } from '../../services';
import { Colors } from '../../themes';

type Props = NativeStackScreenProps<RootStackParamList, 'SmsVerification'>;
const CELL_COUNT = 4;
const SMS_TIMER = 35; // seconds

export const LoginSmsVerificationContainer = ({ navigation, route }: Props) => {
  const authCxt = useContext(AuthContext);

  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { showModal, hideModal } = useGlobalModalContext();
  const { width } = useWindowDimensions();

  const { country, phone } = route.params;

  const [codeErrorMessage, setCodeErrorMessage] = useState<string>('');
  const [code, setCode] = useState('');
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });
  const [countDown, setCountDown] = useState(SMS_TIMER);

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });

  const goBack = () => {
    navigation.navigate('LoginSms');
  };

  useEffect(() => {
    const timer1 =
      countDown > 0 && setInterval(() => setCountDown(countDown - 1), 1000);
    return () => {
      !!timer1 && clearInterval(timer1);
    };
  }, [countDown]);

  useEffect(() => {
    if (code && code.length === 4) {
      setCodeErrorMessage('');
    }
  }, [code]);

  const resendCode = async () => {
    try {
      setLoading(true);
      const response: GenericResponse = await AuthService.requestOtpLogin(
        phone,
        country,
      );

      if (response.success) {
        setCountDown(SMS_TIMER);
        return;
      }

      setScreenErrorMessage(t(response.error || 'phoneNotValid'));
    } catch (error) {
      console.log(error);
      setScreenErrorMessage('no_expected_error_try_again');
    } finally {
      setLoading(false);
    }
  };

  const validateCode = async () => {
    Keyboard.dismiss();

    if (code.length < 4) {
      setCodeErrorMessage(t('codeNotValid'));
      return;
    }

    try {
      setLoading(true);

      const response: LoginResponse = await AuthService.validateOtpLogin(
        phone,
        code,
      );

      if (response.success && response.token) {
        const success = await authCxt.setToken(response.token);
        if (!success) {
          throw new Error(`Couldn't store the user token`);
        }

        await getUserInfo();
      } else {
        setScreenErrorMessage(t(response.error || 'codeNotValid'));
      }
    } catch (error: any) {
      console.log(error);
      setScreenErrorMessage(t(error.error || error.message || 'codeNotValid'));
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = async () => {
    const user = await AuthService.getUser();

    if (user) {
      const success = await authCxt.setUser(user);

      if (!success) {
        throw new Error(`Couldn't store the user data`);
      }
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
            setCode('');
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
      FooterComponent={
        <MegaText styles={{ textAlign: 'center', color: '#C5C5C5' }}>
          {t('copyright')}
        </MegaText>
      }
      useBottomSafeview
      keepFooterComponentAnchored
      isExternal
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
          {t('smsVerifSubtitle')}
        </MegaText>
      </View>

      <View style={styles.phoneContainer}>
        <View>
          <TouchableOpacity onPress={goBack}>
            <LinearGradient
              colors={['#E4F6C3', '#E1EEE7']}
              style={styles.gradient}
            >
              <SVGs.BackPrimaryIcon width={23} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <Flag name="us" styles={{ width: 25, height: 25 }} />
        </View>
        <View>
          <MegaText styles={{ lineHeight: 27 }} size={16}>
            {phone}
          </MegaText>
        </View>
      </View>

      <View>
        <CodeField
          ref={ref}
          {...props}
          value={code}
          onChangeText={setCode}
          cellCount={CELL_COUNT}
          rootStyle={[
            styles.codeFieldRoot,
            width <= 380 && styles.codeFieldRootSmall,
          ]}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <MegaText
              key={index}
              styles={[
                styles.cell,
                isFocused && styles.focusCell,
                !!codeErrorMessage && styles.cellWithError,
              ]}
              nativeProps={{ onLayout: getCellOnLayoutHandler(index) }}
              size={24}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </MegaText>
          )}
        />
        {!!codeErrorMessage && (
          <MegaText
            styles={{
              color: Colors.danger,
              textAlign: 'center',
              marginTop: 5,
            }}
          >
            {codeErrorMessage}
          </MegaText>
        )}
      </View>

      <MegaButton
        text={t('validateAndAccess')}
        variant="secondary"
        onPress={validateCode}
        containerStyles={{ marginTop: 20 }}
      />

      <View style={styles.containerResend}>
        <MegaText>¿No has recibido tu código SMS aún?</MegaText>
        {countDown > 0 && <MegaText>Espera {countDown} segundos.</MegaText>}

        {countDown === 0 && (
          <TouchableOpacity onPress={resendCode}>
            <MegaText styles={{ color: Colors.darkGreen, marginTop: 5 }}>
              {t('resend')}
            </MegaText>
          </TouchableOpacity>
        )}
      </View>
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
  phoneContainer: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border1,
    height: 56,
    backgroundColor: Colors.backgroundScreen,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#00000014',
    shadowOffset: { height: 1, width: 1 },
    shadowRadius: 4,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width: 42,
    height: 32,
    color: Colors.primary,
    marginHorizontal: 20,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: '80%',
    marginLeft: '10%',
  },
  codeFieldRootSmall: {
    marginTop: 20,
    width: '90%',
    marginLeft: '5%',
  },
  cell: {
    width: 69,
    height: 69,
    borderRadius: 6,
    borderWidth: 1,
    lineHeight: 24,
    borderColor: Colors.borderInput,
    color: Colors.regularText,
    textAlign: 'center',
    paddingTop: 25,
  },
  focusCell: {
    borderColor: Colors.regularText,
  },
  cellWithError: {
    borderColor: Colors.danger,
  },
  containerResend: {
    backgroundColor: Colors.backgroundScreen,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.borderInput,
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
  },
});
