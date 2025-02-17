import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { AuthContext } from '../../providers/AuthProvider';
import { Colors } from '../../themes';
import { MegaText } from '../ui';

export const HeaderBalance = () => {
  const { t } = useTranslation();
  const authCxt = useContext(AuthContext);
  const navigation = useNavigation();

  const gotoAddFunds = () => {
    // @ts-ignore
    navigation.navigate('AddFunds');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={gotoAddFunds}>
        <LinearGradient
          colors={['#E4F6C3', '#E1EEE7']}
          style={styles.gradient}
          start={[0.2, 0.2]}
          end={[1, 0]}
        >
          <View style={styles.textContainer}>
            <MegaText>{t('saldo')}: </MegaText>
            <MegaText styles={{ color: Colors.primary }}>
              ${authCxt.userBalance}
            </MegaText>
            <SVGs.AddFunds width={23} fill={Colors.primary} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradient: {
    borderRadius: 16,
    padding: 5,
    paddingHorizontal: 10,
  },
});
