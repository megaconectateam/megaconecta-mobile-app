import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import {
  FontType,
  MegaCard,
  MegaGradient,
  MegaText,
} from '../../components/ui';
import { LinkItem } from '../../models';
import { RootStackParamList, TabStackParamList } from '../../navigation';
import { AuthContext } from '../../providers/AuthProvider';
import { Colors } from '../../themes';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'HomeContainer'
>;

export const HomeContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);

  const linkItems: LinkItem[] = [
    {
      id: '1',
      title: t('market'),
      route: '',
      icon: <SVGs.MarketIcon width={35} height={35} />,
    },
    {
      id: '2',
      title: t('referFriend'),
      route: '',
      icon: <SVGs.ReferFriendIcon width={35} height={35} />,
    },
    {
      id: '3',
      title: t('remittances'),
      route: '',
      icon: <SVGs.RemesasIcon width={35} height={35} />,
    },
    {
      id: '4',
      title: t('reports'),
      route: 'ReportsContainer',
      icon: <SVGs.ReportsIcon width={35} height={35} />,
    },
  ];

  const navigateToFunds = () => {
    navigation.navigate('AddFunds');
  };

  const onTapMenuItem = (item: LinkItem) => {
    if (item.route) {
      navigation.navigate(item.route as any);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.containerFunds}>
          <LinearGradient
            style={styles.gradientContainer}
            colors={['#8AB934', '#6AA500']}
            start={[0, 0]}
            end={[0, 1]}
          >
            <View style={styles.iconContainer}>
              <SVGs.WalletIcon />
            </View>
            <View
              style={{
                flexGrow: 1,
                paddingStart: 10,
                justifyContent: 'center',
              }}
            >
              <MegaText
                styles={{ color: Colors.white, lineHeight: 25 }}
                font={FontType.bold}
                size={20}
              >
                ${authCtx.userBalance}
              </MegaText>
              <MegaText
                styles={{ color: Colors.white, lineHeight: 25 }}
                font={FontType.medium}
                size={16}
              >
                {t('saldo')}
              </MegaText>
            </View>
            <View style={styles.buttonFundContainer}>
              <LinearGradient
                style={styles.gradientButton}
                colors={['#E4F6C3', '#E1EEE7']}
                start={[0, 0]}
                end={[0, 1]}
              >
                <TouchableOpacity
                  onPress={navigateToFunds}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <MegaText
                    styles={{ color: '#263645', lineHeight: 20 }}
                    font={FontType.medium}
                    size={16}
                  >
                    {t('addSaldo')}
                  </MegaText>
                  <SVGs.ArrowGreenItem width={20} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>
      </View>
      <View style={styles.linkContainer}>
        {linkItems.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => onTapMenuItem(item)}>
            <MegaGradient styles={styles.linkItem}>{item.icon}</MegaGradient>
            <MegaText
              size={12}
              styles={{ lineHeight: 17, textAlign: 'center' }}
            >
              {item.title}
            </MegaText>
          </TouchableOpacity>
        ))}
      </View>

      <MegaCard
        containerStyles={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={() => {
          navigation.navigate('CustomerSupportContainer');
        }}
      >
        <View style={{ marginRight: 10 }}>
          <MegaGradient icon={<SVGs.CustomerSupportIcon />} />
        </View>
        <View style={styles.titleContainer}>
          <MegaText
            size={16}
            font={FontType.medium}
            styles={{ lineHeight: 22, color: Colors.primary }}
          >
            {t('customerSupportSection.title')}
          </MegaText>
          <MegaText size={13} styles={{ lineHeight: 20 }}>
            {t('customerSupportSection.quickLinkDescription')}
          </MegaText>
        </View>
        <View>
          <SVGs.ArrowListItem width={15} fill={Colors.borderInput} />
        </View>
      </MegaCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  containerFunds: {
    width: '100%',
    borderRadius: 12,
    marginTop: 16,
  },
  gradientContainer: {
    padding: 10,
    width: '100%',
    borderRadius: 12,
    flexDirection: 'row',
    maxHeight: 70,
  },
  iconContainer: {
    width: 53,
    height: 53,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFundContainer: {
    borderRadius: 10,
  },
  gradientButton: {
    borderRadius: 10,
    height: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  linkItem: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
    flex: 1,
  },
});
