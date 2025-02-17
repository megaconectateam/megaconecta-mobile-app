import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { toLower } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { SVGs } from '../../../assets/svg';
import { MenuList, MenuListItem } from '../../../components';
import { Flag, FontType, MegaButton, MegaText } from '../../../components/ui';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { Colors } from '../../../themes';
import { formatCardNumber } from '../../../utils';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'ContactDetailContainer'
>;

export const ContactDetailContainer = (props: Props) => {
  const { t } = useTranslation();
  const params = props.route.params;

  const [links, setLinks] = useState<MenuListItem[]>([]);

  useEffect(() => {
    const localLinks = [];
    if (
      params.phoneContact.isMegaconecta ||
      (!params.phoneContact.isMegaconecta && params.phoneContact.countryCode)
    ) {
      localLinks.push({
        name: t('topupCellphone'),
        icon: <SVGs.RecargarIcon width={23} height={23} />,
        route: '',
      });
    }

    if (
      params.phoneContact.isMegaconecta &&
      toLower(params.phoneContact.countryCode) === 'cu'
    ) {
      localLinks.push({
        name: t('topupData'),
        icon: <SVGs.RecargarDatosIcon width={23} height={23} />,
        route: '',
      });
    }

    if (params.phoneContact.emailNauta) {
      localLinks.push({
        name: t('topupNauta'),
        icon: <SVGs.RecargarNautaIcon width={23} height={23} />,
        route: '',
      });
    }

    localLinks.push({
      name: t('sendSms'),
      icon: <SVGs.SmsIcon width={23} height={23} />,
      route: '',
    });

    if (
      params.phoneContact.isMegaconecta &&
      params.acceptRemittance &&
      toLower(params.phoneContact.countryCode) === 'cu'
    ) {
      localLinks.push({
        name: t('sendRemittance'),
        icon: <SVGs.RemesasIcon width={23} height={23} />,
        route: '',
      });
    }

    setLinks(localLinks);
  }, []);

  const hasDetails = () => {
    if (params.phoneContact.emailNauta) {
      return true;
    }

    if (params.isMegaContact && params.megaContact) {
      return (
        params.megaContact.carnet ||
        params.megaContact.address ||
        params.megaContact.municipality_name ||
        params.megaContact.province_name ||
        params.megaContact.mlc_card
      );
    }

    return false;
  };

  return (
    <ScrollView
      style={{ paddingHorizontal: 16 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <SafeAreaView>
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <View style={styles.initialContainer}>
            <MegaText
              size={30}
              font={FontType.medium}
              styles={{ lineHeight: 40, color: Colors.darkGreen }}
            >
              {params.phoneContact.initials}
            </MegaText>
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{ lineHeight: 21, color: Colors.primary }}
          >
            {params.phoneContact.fullName}
          </MegaText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Flag
            name={toLower(params.phoneContact.countryCode)}
            styles={{ height: 20, width: 20, marginRight: 5 }}
          />
          <MegaText size={15} styles={{ lineHeight: 27, color: '#616161' }}>
            {params.phoneContact.formattedPhone}
          </MegaText>
        </View>

        {hasDetails() && (
          <View style={styles.containerDetails}>
            {params.phoneContact.emailNauta && (
              <View>
                <MegaText
                  size={15}
                  font={FontType.medium}
                  styles={{ lineHeight: 27, color: Colors.primary }}
                >
                  {params.phoneContact.emailNauta}
                </MegaText>
              </View>
            )}

            {params.megaContact?.carnet && (
              <View style={{ flexDirection: 'row' }}>
                <MegaText
                  size={13}
                  styles={{ lineHeight: 27, color: '#616161' }}
                >
                  {t('contactSection.carnet')}:{' '}
                </MegaText>
                <MegaText
                  size={13}
                  font={FontType.medium}
                  styles={{ lineHeight: 27, color: Colors.primary }}
                >
                  {params.megaContact.carnet}
                </MegaText>
              </View>
            )}

            {params.megaContact?.mlc_card && (
              <View style={{ flexDirection: 'row' }}>
                <MegaText
                  size={13}
                  styles={{ lineHeight: 27, color: '#616161' }}
                >
                  {t('contactSection.mlcCard')}:{' '}
                </MegaText>
                <MegaText
                  size={13}
                  font={FontType.medium}
                  styles={{ lineHeight: 27, color: Colors.primary }}
                >
                  {formatCardNumber(params.megaContact.mlc_card)}
                </MegaText>
              </View>
            )}

            {params.megaContact?.address && (
              <View style={{ flexDirection: 'row' }}>
                <MegaText
                  size={13}
                  styles={{ lineHeight: 27, color: '#616161' }}
                >
                  {params.megaContact?.address || ''}
                  {params.megaContact?.town ? ', ' : ''}
                  {params.megaContact?.town || ''}
                </MegaText>
              </View>
            )}

            {(params.megaContact?.municipality_name ||
              params.megaContact?.province_name) && (
              <View style={{ flexDirection: 'row' }}>
                <MegaText
                  size={13}
                  styles={{ lineHeight: 27, color: '#616161' }}
                >
                  {params.megaContact?.province_name}
                  {params.megaContact?.municipality_name ? ', ' : ''}
                  {params.megaContact?.municipality_name || ''}
                </MegaText>
              </View>
            )}
          </View>
        )}

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'column',
            paddingTop: 30,
            paddingBottom: 10,
          }}
        >
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{ lineHeight: 21, color: Colors.primary }}
          >
            {t('contactSection.queDeseaHacer')}
          </MegaText>
        </View>

        <MenuList items={links} />

        <View style={{ paddingVertical: 20 }}>
          <MegaButton text={t('call')} variant="secondary" onPress={() => {}} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 20,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    maxHeight: '95%',
  },
  initialContainer: {
    width: 70,
    height: 70,
    borderRadius: 44,
    backgroundColor: '#E1EEE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButton: {
    borderRadius: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  contactMenuLink: {
    borderRadius: 12,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
    width: '100%',
    marginBottom: 10,
  },
  iconBackground: {
    width: 40,
    height: 40,
  },
  containerDetails: {
    flexDirection: 'column',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#030047',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    marginTop: 20,
    marginBottom: 0,
  },
});
