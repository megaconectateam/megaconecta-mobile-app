import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SVGs } from '../../assets/svg';
import { MegaSteps } from '../../components';
import { ScreenWithKeyboard } from '../../components/ui';
import { RootStackParamList } from '../../navigation';
import { RegisterPage, RegisterValidationPage } from '../../pages';
import { Colors } from '../../themes';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

export const CreateAccountContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState<number>(1);

  const goBack = () => {
    if (currentStep === 1) {
      navigation.replace('Login');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            marginLeft: -20,
          }}
        >
          <TouchableOpacity onPress={goBack}>
            <LinearGradient
              colors={['#E4F6C3', '#E1EEE7']}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 15,
                width: 42,
                height: 32,
                marginHorizontal: 20,
              }}
            >
              <SVGs.BackPrimaryIcon width={23} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const onContinueStep1 = () => {
    setCurrentStep(2);
  };

  return (
    <>
      <View style={{ backgroundColor: Colors.white, paddingTop: 20 }}>
        <MegaSteps
          activeStep={currentStep}
          step1={t('personalData')}
          step2={t('validation')}
        />
      </View>

      <ScreenWithKeyboard isExternal>
        {currentStep === 1 && <RegisterPage onContinue={onContinueStep1} />}
        {currentStep === 2 && <RegisterValidationPage />}

        <SafeAreaView style={styles.spacing} />
      </ScreenWithKeyboard>
    </>
  );
};

const styles = StyleSheet.create({
  spacing: {
    backgroundColor: Colors.white,
    minHeight: 16,
  },
});
