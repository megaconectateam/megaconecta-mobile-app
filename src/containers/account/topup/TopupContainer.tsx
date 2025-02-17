import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../../assets/svg';
import { FontType, MegaText } from '../../../components/ui';
import { TopupStackParamList } from '../../../navigation/tab-items/index';
import { Colors } from '../../../themes';

type Props = NativeStackScreenProps<TopupStackParamList>;

export const TopupContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();

  const menuList = [
    {
      title: t('topupCellphone'),
      description: t('topupSection.topupCelDescription'),
      icon: <SVGs.RecargarIcon width={30} height={30} />,
      route: 'TopupMobileContainer',
    },
    {
      title: t('topupNauta'),
      description: t('topupSection.topupNautaDescription'),
      icon: <SVGs.RecargarNautaIcon width={30} height={30} />,
      route: 'TopupNautaContainer',
    },
  ];

  const onTap = (route: string) => {
    navigation.navigate(route as any);
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        backgroundColor: Colors.backgroundScreen,
        flex: 1,
      }}
    >
      <View style={{ paddingVertical: 20 }}>
        <MegaText
          size={18}
          font={FontType.medium}
          styles={{
            lineHeight: 21,
            color: Colors.primary,
            textAlign: 'center',
          }}
        >
          {t('topupSection.topupQuestion')}
        </MegaText>
      </View>

      <View>
        {menuList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => onTap(item.route)}
          >
            <View style={{ marginRight: 10 }}>
              <LinearGradient
                style={styles.iconGradient}
                colors={['#E4F6C3', '#E1EEE7']}
                start={[0, 0]}
                end={[0, 1]}
              >
                {item.icon}
              </LinearGradient>
            </View>
            <View style={{ flexGrow: 1 }}>
              <View>
                <MegaText
                  size={16}
                  font={FontType.medium}
                  styles={{
                    lineHeight: 24,
                    color: Colors.primary,
                  }}
                >
                  {item.title}
                </MegaText>
              </View>
              <View>
                <MegaText
                  size={13}
                  styles={{
                    lineHeight: 21,
                    color: '#616161',
                  }}
                >
                  {item.description}
                </MegaText>
              </View>
            </View>
            <View>
              <SVGs.ArrowListItem width={23} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 12,

    shadowColor: '#030047',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  iconGradient: {
    width: 51,
    height: 51,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
