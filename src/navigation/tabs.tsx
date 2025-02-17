import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { useNavigation } from '@react-navigation/native';
import { Dimensions, Platform, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../assets/svg';
import { HeaderBalance } from '../components';
import {
  AccountContainer,
  CallsContainer,
  HomeContainer,
  SmsContainer,
} from '../containers/account';
import { ContactPhone, MegaContact } from '../models';
import { Colors } from '../themes';
import { TopupTabNavigation } from './tab-items';

export type TabStackParamList = {
  HomeContainer: undefined;
  Calls: { defaultPage?: 'teclado' | 'contactos' | 'recientes' };
  Topups: undefined;
  SendSms: undefined;
  Account: undefined;
  ContactDetailRoute: {
    isMegaContact: boolean;
    phoneContact: ContactPhone;
    megaContact?: MegaContact;
    acceptRemittance: boolean;
  };
  ContactDetailContainer: {
    isMegaContact: boolean;
    phoneContact: ContactPhone;
    megaContact?: MegaContact;
    acceptRemittance: boolean;
  };
};

const MainTabs = createBottomTabNavigator<TabStackParamList>();

export const Tabs = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const screenHeight = Dimensions.get('window').height;

  const realHeight = Platform.select({
    ios: (screenHeight * 11) / 100,
    android: (screenHeight * 9) / 100,
  });

  return (
    <MainTabs.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 12,
          textTransform: 'capitalize',
          lineHeight: 27,
        },
        tabBarIconStyle: {
          marginTop: 0,
          paddingTop: 0,
        },
        tabBarStyle: {
          backgroundColor: Colors.white,
          height: realHeight,
        },
        tabBarItemStyle: {
          marginTop: 5,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.primary,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTitleStyle: {
          color: Colors.white,
        },
      }}
    >
      <MainTabs.Screen
        name="HomeContainer"
        component={HomeContainer}
        options={{
          title: t('home'),
          tabBarLabel: t('home'),
          tabBarIcon: (props) => <IconTab icon="home" {...props} />,
          headerStyle: {
            backgroundColor: '#f9f9f9',
            borderBottomWidth: 0,
            shadowColor: 'transparent',
          },
          headerTitle: '',
          headerLeft: () => <SVGs.LogoColored width={170} />,
          headerLeftContainerStyle: {
            marginStart: 16,
          },
          headerRightContainerStyle: {
            marginEnd: 16,
          },
        }}
      />

      <MainTabs.Screen
        name="Calls"
        component={CallsContainer}
        options={{
          title: t('calls'),
          tabBarLabel: t('calls'),
          tabBarIcon: (props) => <IconTab icon="calls" {...props} />,
          headerStyle: {
            backgroundColor: Colors.darkGreen,
            borderBottomWidth: 0,
            shadowColor: 'transparent',
          },
          headerTitle: '',
          headerLeftContainerStyle: {
            marginStart: 16,
          },
          headerRightContainerStyle: {
            marginEnd: 16,
          },
          headerLeft: () => <HeaderBalance />,
        }}
      />

      <MainTabs.Screen
        name="Topups"
        component={TopupTabNavigation}
        options={{
          title: t('topups'),
          tabBarLabel: t('topups'),
          tabBarIcon: (props) => <IconTab icon="topups" {...props} />,
          headerShown: false,
        }}
      />

      <MainTabs.Screen
        name="SendSms"
        component={SmsContainer}
        options={{
          title: t('sendSms'),
          tabBarLabel: t('sendSms'),
          tabBarIcon: (props) => <IconTab icon="sms" {...props} />,
          headerStyle: {
            backgroundColor: Colors.darkGreen,
            borderBottomWidth: 0,
            shadowColor: 'transparent',
          },
          headerTitle: '',
          headerLeftContainerStyle: {
            marginStart: 16,
          },
          headerRightContainerStyle: {
            marginEnd: 16,
          },
          headerLeft: () => <HeaderBalance />,
        }}
      />

      <MainTabs.Screen
        name="Account"
        component={AccountContainer}
        options={{
          title: t('myAccount'),
          tabBarLabel: t('myAccount'),
          tabBarIcon: (props) => <IconTab icon="account" {...props} />,
          headerStyle: {
            backgroundColor: Colors.darkGreen,
            borderBottomWidth: 0,
            shadowColor: 'transparent',
          },
          headerTitle: '',
          headerLeftContainerStyle: {
            marginStart: 16,
          },
          headerRightContainerStyle: {
            marginEnd: 16,
          },
          headerLeft: () => <HeaderBalance />,
          headerRight: () => (
            <View style={{ width: 23 }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditAccountContainer');
                }}
              >
                <SVGs.EditAccount width={23} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </MainTabs.Navigator>
  );
};

const IconTab = ({
  focused,
  icon,
  size,
}: {
  focused: boolean;
  icon: 'home' | 'calls' | 'topups' | 'sms' | 'account';
  size: number;
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'home':
        return focused ? (
          <SVGs.Tabs.Active.Inicio width={size} />
        ) : (
          <SVGs.Tabs.Default.Inicio width={size} />
        );
      case 'calls':
        return focused ? (
          <SVGs.Tabs.Active.Llamadas width={size} />
        ) : (
          <SVGs.Tabs.Default.Llamadas width={size} />
        );
      case 'topups':
        return focused ? (
          <SVGs.Tabs.Active.Recargas width={size} />
        ) : (
          <SVGs.Tabs.Default.Recargas width={size} />
        );
      case 'sms':
        return focused ? (
          <SVGs.Tabs.Active.Sms width={size} />
        ) : (
          <SVGs.Tabs.Default.Sms width={size} />
        );
      case 'account':
        return focused ? (
          <SVGs.Tabs.Active.Account width={size} />
        ) : (
          <SVGs.Tabs.Default.Account width={size} />
        );
    }
  };

  return (
    <>
      {focused && (
        <View
          style={{
            backgroundColor: Colors.darkGreen,
            width: 64,
            height: 4,
            borderBottomRightRadius: 11,
            borderBottomLeftRadius: 11,
            position: 'absolute',
            top: -5,
          }}
        />
      )}
      {getIcon()}
    </>
  );
};
