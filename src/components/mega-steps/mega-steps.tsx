import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../themes';
import { FontType, MegaText } from '../ui';

export type MegaStepsProps = {
  step1: string;
  step2: string;
  activeStep: number;
};

export const MegaSteps = (props: MegaStepsProps) => {
  const { t } = useTranslation();

  const getColorBasedOnStep = (step: number) => {
    if (props.activeStep === 1) {
      if (step === 1) {
        return ['#E1EEE7', '#8AB934'];
      }
      if (step === 2) {
        return ['#EBEBEB', '#EBEBEB'];
      }
    }

    if (props.activeStep === 2) {
      if (step === 1) {
        return ['#E1EEE7', '#B5D38C'];
      }
      if (step === 2) {
        return ['#B5D38C', '#8BBA35'];
      }
    }

    return [];
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerText}>
        <MegaText font={FontType.medium} styles={{ color: Colors.darkGreen }}>
          {t('paso')} {props.activeStep}
        </MegaText>
        <MegaText font={FontType.medium}>
          /2: {props.activeStep === 1 ? props.step1 : props.step2}
        </MegaText>
      </View>
      <View style={styles.containerSteps}>
        <View style={[styles.step, styles.step1]}>
          <LinearGradient
            colors={[...getColorBasedOnStep(1)]}
            style={styles.gradient}
            start={[0.2, 0.2]}
            end={[1, 0]}
          >
            {props.activeStep === 1 && <View style={styles.whiteBullet} />}
          </LinearGradient>
        </View>
        <View style={[styles.step, styles.step2]}>
          <LinearGradient
            colors={[...getColorBasedOnStep(2)]}
            style={styles.gradient}
            start={[0.2, 0.2]}
            end={[1, 0]}
          >
            {props.activeStep === 2 && <View style={styles.whiteBullet} />}
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
  containerText: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  containerSteps: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  step: {
    height: 8,
    width: '49%',
    backgroundColor: '#EBEBEB',
  },
  step1: {
    marginEnd: '1%',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  step2: {
    marginStart: '1%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  whiteBullet: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: Colors.white,
    alignSelf: 'flex-end',
    marginRight: 2,
  },
});
