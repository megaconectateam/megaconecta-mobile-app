import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
import { RegisterService } from '../../services';
import { Colors, themeStyles } from '../../themes';
import {
  Flag,
  FontType,
  MegaButton,
  MegaErrorMsg,
  MegaModal,
  MegaText,
} from '../ui';

const CELL_COUNT = 4;

export type PinModalProps = {
  isVisible: boolean;
  phone: string;
  formattedPhone: string;
  country?: string;
  onClose: (isValid: boolean) => void;
};

export const PinModal = ({
  isVisible,
  phone,
  formattedPhone,
  country,
  onClose,
}: PinModalProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const [codeErrorMessage, setCodeErrorMessage] = useState<string>('');
  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);
  const [code, setCode] = useState('');
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });

  useEffect(() => {
    if (code && code.length === 4) {
      setCodeErrorMessage('');
    }
  }, [code]);

  const validateCode = async () => {
    try {
      setIsLocalLoading(true);
      const response = await RegisterService.validatePin(phone, code);

      if (!response.success) {
        switch (response.code) {
          case '003':
            setCodeErrorMessage(t('accountSection.pinValidationErrors.003'));
            break;

          case '002':
          case '004':
            setCodeErrorMessage(
              t('accountSection.pinValidationErrors.invalid_code'),
            );
            break;

          case '500':
          default:
            setCodeErrorMessage(t('accountSection.pinValidationErrors.500'));
            break;
        }

        return;
      }

      onClose(true);
    } catch (error) {
      console.log(error);
      setCodeErrorMessage(t('accountSection.pinValidationErrors.500'));
    } finally {
      setIsLocalLoading(false);
    }
  };

  return (
    <MegaModal
      isLoading={isLocalLoading}
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
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{
              lineHeight: 21,
              color: Colors.primary,
              textAlign: 'center',
            }}
          >
            {t('accountSection.validatePin')}
          </MegaText>

          <View style={{ position: 'absolute', top: 2, right: 0 }}>
            <TouchableOpacity onPress={() => onClose(false)}>
              <SVGs.CloseIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <MegaText styles={{ textAlign: 'center' }}>
            {t('smsVerifSubtitle')}
          </MegaText>
        </View>

        <View style={styles.phoneContainer}>
          {!!country && (
            <View style={{ marginHorizontal: 20 }}>
              <Flag name={country} styles={{ width: 25, height: 25 }} />
            </View>
          )}
          <View>
            <MegaText styles={{ lineHeight: 27 }} size={16}>
              {formattedPhone}
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
              width <= 400 && styles.codeFieldRootSmall,
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
            <MegaErrorMsg
              message={codeErrorMessage}
              containerStyles={{ marginTop: 16 }}
            />
          )}
        </View>

        <MegaButton
          text={t('accountSection.validate')}
          variant="secondary"
          onPress={validateCode}
          containerStyles={{ marginTop: 30, marginBottom: 20 }}
        />
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
  phoneContainer: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border1,
    height: 56,
    backgroundColor: Colors.backgroundScreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,

    ...themeStyles.shadow,
  },
  codeFieldRoot: {
    marginTop: 30,
    width: '80%',
    marginLeft: '10%',
  },
  codeFieldRootSmall: {
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
    marginBottom: 0,
  },
});
