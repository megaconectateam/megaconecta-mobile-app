import * as Application from 'expo-application';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18next';
import { toLower, toUpper } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SVGs } from '../../../assets/svg';
import { MenuList, MenuListItem, ModalLanguage } from '../../../components';
import { FontType, MegaText } from '../../../components/ui';
import { AuthContext } from '../../../providers/AuthProvider';
import { ProfileContext } from '../../../providers/ProfileProvider';
import { Colors } from '../../../themes';

export const AccountContainer = () => {
  const { t } = useTranslation();
  const { profile, canDoRemittance } = useContext(ProfileContext);

  const authCtxt = useContext(AuthContext);

  const ITEM_SERVICES: MenuListItem[] = [
    {
      name: t('accountSection.menuList.promos'),
      icon: <SVGs.Account.Servicios.Promos />,
    },
    {
      name: t('accountSection.menuList.market'),
      icon: <SVGs.Account.Servicios.Store />,
    },
    {
      name: t('accountSection.menuList.referAndEarn'),
      icon: <SVGs.Account.Servicios.Refer />,
      route: 'ReferralContainer',
    },
  ];

  const [isModalLanguageVisible, setIsModalLanguageVisible] = useState(false);
  const [itemsServices, setItemsServices] = useState(ITEM_SERVICES);

  const getName = () => {
    return `${authCtxt.authUser?.CUSTOMERNAME} ${authCtxt.authUser?.CUSTOMER_LASTNAME}`;
  };

  const getInitials = () => {
    return `${authCtxt.authUser?.CUSTOMERNAME?.charAt(
      0,
    )}${authCtxt.authUser?.CUSTOMER_LASTNAME?.charAt(0)}`;
  };

  const getAddress = () => {
    if (!profile) return '';

    let address = '';

    if (profile.user.address.address1) {
      address += profile.user.address.address1 + ', ';
    }

    if (profile.user.address.city) {
      address += profile.user.address.city + ', ';
    }

    if (profile.user.address.state) {
      address += profile.user.address.state + ', ';
    }

    address += toUpper(profile.user.address.country);
    return address;
  };

  const itemsAccount: MenuListItem[] = [
    {
      name: t('accountSection.menuList.manageAddress'),
      icon: <SVGs.Account.Cuenta.Direcciones />,
      route: 'MegaContactAddressContainer',
    },
    {
      name: t('accountSection.menuList.paymentMethods'),
      icon: <SVGs.Account.Cuenta.MetodosPagos />,
      route: 'PaymentMethodsContainer',
    },
    {
      name: t('accountSection.menuList.myReports'),
      icon: <SVGs.Account.Cuenta.Reportes />,
      route: 'ReportsContainer',
    },
  ];

  const itemsSettings: MenuListItem[] = [
    {
      name: t('accountSection.menuList.password'),
      value: '********',
      icon: <SVGs.Account.Ajustes.Password />,
      route: 'AccountPasswordContainer',
    },
    {
      name: t('accountSection.menuList.getNotifications'),
      value: t('accountSection.menuList.smsEmail'),
      icon: <SVGs.Account.Ajustes.Notifications />,
      route: 'GetPromotionsContainer',
    },
    {
      name: t('accountSection.menuList.language'),
      value:
        i18n.language === 'en'
          ? t('languageSection.english')
          : t('languageSection.spanish'),
      icon: <SVGs.Account.Ajustes.Language />,
      onPress: () => setIsModalLanguageVisible(true),
    },
  ];

  const itemsHelp: MenuListItem[] = [
    {
      name: t('accountSection.menuList.customerSupport'),
      icon: <SVGs.Account.Ayuda.CustomerSupport />,
      route: 'CustomerSupportContainer',
    },
    {
      name: t('accountSection.menuList.termsAndConditions'),
      icon: <SVGs.Account.Ayuda.TermConditions />,
      route: 'TermAndConditionsContainer',
    },
    {
      name: t('accountSection.menuList.privacyPolicy'),
      icon: <SVGs.Account.Ayuda.Privacy />,
      route: 'PrivacyPolicyContainer',
    },
  ];

  const itemsSignOut: MenuListItem[] = [
    {
      name: t('accountSection.menuList.logout'),
      icon: <SVGs.Logout />,
      isPink: true,
      onPress: authCtxt.logOut,
    },
  ];

  useEffect(() => {
    if (canDoRemittance) {
      setItemsServices([
        ...ITEM_SERVICES,
        {
          name: t('accountSection.menuList.remittances'),
          icon: <SVGs.Account.Servicios.Remittance />,
        },
      ]);
    }
  }, [canDoRemittance]);

  return (
    <>
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.darkGreen, '#6AA500']}
          start={[0, 0]}
          end={[0, 1]}
          style={styles.gradient}
        >
          {false && (
            <View style={styles.circular}>
              <MegaText
                size={30}
                font={FontType.medium}
                styles={{
                  lineHeight: 40,
                  margin: 0,
                  padding: 0,
                  color: Colors.darkGreen,
                }}
              >
                {getInitials()}
              </MegaText>
            </View>
          )}
          <View style={{ marginTop: 15 }}>
            <MegaText
              size={25}
              font={FontType.medium}
              styles={{ lineHeight: 27, color: Colors.white }}
            >
              {getName()}
            </MegaText>
          </View>
          <View style={{ marginTop: 5 }}>
            <MegaText
              size={15}
              styles={{ lineHeight: 27, color: Colors.white }}
            >
              {toLower(authCtxt.authUser?.EMAILADDRESS)}
            </MegaText>
          </View>
          <View style={{ marginTop: 5, paddingBottom: 20 }}>
            <MegaText
              size={15}
              styles={{ lineHeight: 27, color: Colors.white }}
            >
              {getAddress()}
            </MegaText>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <MenuList
          title={t('accountSection.menuList.account')}
          items={itemsAccount}
        />
        <MenuList
          title={t('accountSection.menuList.services')}
          items={itemsServices}
        />
        <MenuList
          title={t('accountSection.menuList.settings')}
          items={itemsSettings}
        />
        <MenuList title={t('accountSection.menuList.help')} items={itemsHelp} />
        <MenuList items={itemsSignOut} />

        <View
          style={{
            marginVertical: 20,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SVGs.LogoColored width={220} />

          <MegaText size={14} styles={{ lineHeight: 27, color: '#949494' }}>
            {`v${Application.nativeApplicationVersion}`}
          </MegaText>
          <MegaText size={14} styles={{ lineHeight: 27, color: '#949494' }}>
            Copyright © Mega Connect Corp
          </MegaText>
        </View>
      </ScrollView>

      <ModalLanguage
        isVisible={isModalLanguageVisible}
        onClose={() => {
          setIsModalLanguageVisible(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  gradient: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circular: {
    marginTop: 10,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E1EEE6',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: Colors.backgroundScreen,
    padding: 12,
  },
});
