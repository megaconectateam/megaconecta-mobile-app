import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleProp,
  StyleSheet,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import zxcvbn from 'zxcvbn';
import { SVGs } from '../../assets/svg';
import { Colors } from '../../themes';
import { MegaInput } from './mega-input';
import { MegaText } from './mega-text';

export type MegaPasswordProps = {
  nativeProps: TextInputProps;
  errorMessage?: string;
  label?: string;
  value: string;
  inputStyles?: StyleProp<TextStyle>;
  onChangeText?: (text: string) => void;
  hasStrengthMeter?: boolean;
};

export const MegaPassword = (props: MegaPasswordProps) => {
  const { t } = useTranslation();
  const [confirmPasswordSecureEntry, setConfirmPasswordSecureEntry] =
    useState<boolean>(true);

  const [passScore, setPassScore] = useState<0 | 1 | 2 | 3 | 4>(0);

  const onChangeText = (value: string) => {
    const { score } = zxcvbn(value);
    setPassScore(score);
    props.onChangeText && props.onChangeText(value);
  };

  return (
    <View>
      <MegaInput
        label={props.label}
        nativeProps={{
          ...props.nativeProps,
          secureTextEntry: confirmPasswordSecureEntry,
        }}
        inputStyles={props.inputStyles}
        value={props.value}
        onChangeText={onChangeText}
        iconRight={
          <TouchableOpacity
            onPress={() =>
              setConfirmPasswordSecureEntry(!confirmPasswordSecureEntry)
            }
          >
            {confirmPasswordSecureEntry && <SVGs.PasswordEye width={23} />}
            {!confirmPasswordSecureEntry && (
              <SVGs.PasswordEyeOffIcon width={23} />
            )}
          </TouchableOpacity>
        }
        errorMessage={props.errorMessage}
      />

      {props.hasStrengthMeter && (
        <View>
          <View style={styles.meterContainer}>
            <View
              style={[
                styles.meterItemContainer,
                passScore >= 1 && styles.meterItemActive,
              ]}
            />
            <View
              style={[
                styles.meterItemContainer,
                passScore >= 2 && styles.meterItemActive,
              ]}
            />
            <View
              style={[
                styles.meterItemContainer,
                passScore >= 3 && styles.meterItemActive,
              ]}
            />
            <View
              style={[
                styles.meterItemContainer,
                passScore >= 4 && styles.meterItemActive,
              ]}
            />
          </View>
          <View>
            <MegaText
              styles={{ textAlign: 'right', color: '#8F979F' }}
              size={13}
            >
              {t(`passwordStrength.${passScore}`)}
            </MegaText>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  meterContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  meterItemContainer: {
    height: 2,
    borderRadius: 2,
    backgroundColor: Colors.borderInput,
    flex: 1,
  },
  meterItemActive: {
    backgroundColor: Colors.darkGreen,
  },
});
