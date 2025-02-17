import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '.';
import {
  AccountPasswordContainer,
  AddFundContainer,
  CustomerSupportContainer,
  EditAccountContainer,
  GetPromotionsContainer,
  MegaContactAddressContainer,
  PaymentMethodsContainer,
  PrivacyPolicyContainer,
  ReferralContainer,
  ReportRemittanceDetailsContainer,
  ReportStoreDetailsContainer,
  ReportsContainer,
  TermAndConditionsContainer
} from '../containers/account';
import {
  ChangePasswordContainer,
  CreateAccountContainer,
  ForgotPasswordContainer,
  LoginContainer,
  LoginSmsContainer,
  LoginSmsVerificationContainer,
  OnBoardContainer,
} from '../containers/external';
import { AuthContext } from '../providers/AuthProvider';
import { ProfileContext, ProfileProvider } from '../providers/ProfileProvider';
import { Colors, themeStyles } from '../themes';
import { LocalStorageService } from '../utils';
import { SVGs } from './../assets/svg';
import { ContactDetailRoute } from './routes/contact-detail-route';
import { ContactEditionRoute } from './routes/contact-edition-route';
import { CountrySelectorModal } from './routes/country-selector';
import { CreditCardFormRoute } from './routes/credit-card-route';
import { GenericSelectorModal } from './routes/generic-selector';
import { TabStackParamList, Tabs } from './tabs';

const Stack = createNativeStackNavigator<
  RootStackParamList & TabStackParamList
>();

const ONBOARD_MONTHS = 1;

export const Root = () => {
  const { isAuth } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!isAuth && <AnonymousStack />}
      {isAuth && <AuthenticatedStack />}
    </NavigationContainer>
  );
};

const AnonymousStack = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    getInitialRoute();
  }, []);

  const getInitialRoute = async () => {
    const date: Date | null = await LocalStorageService.getOnBoardVisited();

    if (!date) {
      navigation.navigate('OnBoard');
      return;
    }

    const futureDate = moment(date).add(ONBOARD_MONTHS, 'months');
    if (!moment().isBefore(futureDate)) {
      navigation.navigate('OnBoard');
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="LoginSms"
      screenOptions={{
        animation: 'fade',
        headerStyle: {
          backgroundColor: Colors.darkGreen,
        },
        headerTintColor: Colors.lightGray,
        headerTitleStyle: {
          color: Colors.white,
        },
      }}
    >
      <Stack.Screen
        name="OnBoard"
        component={OnBoardContainer}
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          gestureEnabled: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="LoginSms"
        component={LoginSmsContainer}
        options={{
          animation: 'slide_from_right',
          headerShown: false,
          gestureEnabled: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ForgotPasswordContainer"
        component={ForgotPasswordContainer}
        options={{
          animation: 'slide_from_right',
          headerShown: true,
          headerBackTitleVisible: true,
          gestureEnabled: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: Colors.primary,
          },
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
        }}
      />
      <Stack.Screen
        name="ChangePasswordContainer"
        component={ChangePasswordContainer}
        options={{
          animation: 'slide_from_right',
          headerShown: true,
          headerBackTitleVisible: true,
          gestureEnabled: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: Colors.primary,
          },
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
        }}
      />
      <Stack.Screen
        name="SmsVerification"
        component={LoginSmsVerificationContainer}
        options={{
          animation: 'slide_from_right',
          headerShown: false,
          gestureEnabled: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginContainer}
        options={{
          animation: 'slide_from_right',
          animationTypeForReplace: 'pop',
          headerShown: false,
          gestureEnabled: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountContainer}
        options={{
          animation: 'slide_from_right',
          headerShown: true,
          headerBackTitleVisible: true,
          gestureEnabled: false,
          headerTitle: t('createAccount'),
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTitleStyle: {
            color: Colors.primary,
          },
        }}
      />
      <Stack.Screen
        name="CountrySelectorModal"
        component={CountrySelectorModal}
        options={{
          headerShown: false,
          headerTransparent: true,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

const AuthenticatedStack = () => {
  const { profile } = useContext(ProfileContext);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const addContact = () => {
    navigation.navigate('ContactEditionRoute', {
      isNewContact: true,
      editContact: undefined,
      acceptRemittance: !!profile?.user.accept_remittance,
    });
  };

  return (
    <ProfileProvider>
      <Stack.Navigator
        initialRouteName="tabs"
        screenOptions={{
          headerShown: false,
          animationTypeForReplace: 'push',
          gestureEnabled: false,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="tabs"
          component={Tabs}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
          }}
        />

        <Stack.Screen
          name="AddFunds"
          component={AddFundContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('addSaldo')}
              </Text>
            ),
          }}
        />

        <Stack.Screen
          name="EditAccountContainer"
          component={EditAccountContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('editAccount')}
              </Text>
            ),
          }}
        />

        <Stack.Screen
          name="CountrySelectorModal"
          component={CountrySelectorModal}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="GenericSelectorModal"
          component={GenericSelectorModal}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="ContactDetailRoute"
          component={ContactDetailRoute}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="ContactEditionRoute"
          component={ContactEditionRoute}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="CreditCardFormRoute"
          component={CreditCardFormRoute}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />

        {/* <Stack.Screen
          name="TopupDataContainer"
          component={TopupDataContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('topupData')}
              </Text>
            ),
          }}
        /> */}

        <Stack.Screen
          name="ReportsContainer"
          component={ReportsContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('reports')}
              </Text>
            ),
          }}
        />

        <Stack.Screen
          name="CustomerSupportContainer"
          component={CustomerSupportContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('customerSupportSection.title')}
              </Text>
            ),
          }}
        />

        <Stack.Screen
          name="TermAndConditionsContainer"
          component={TermAndConditionsContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('accountSection.menuList.termsAndConditions')}
              </Text>
            ),
          }}
        />

        <Stack.Screen
          name="PrivacyPolicyContainer"
          component={PrivacyPolicyContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('accountSection.menuList.privacyPolicy')}
              </Text>
            ),
          }}
        />

        <Stack.Screen
          name="ReferralContainer"
          component={ReferralContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('accountSection.menuList.referAndEarn')}
              </Text>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.ReferralReportIcon width={20} />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="MegaContactAddressContainer"
          component={MegaContactAddressContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('contactSection.myContacts')}
              </Text>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={addContact}>
                <SVGs.Payment.AddCircleIcon fill="#ffffff" width={20} />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="PaymentMethodsContainer"
          component={PaymentMethodsContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('paymentMethods')}
              </Text>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={addContact}>
                <SVGs.Payment.AddCircleIcon fill="#ffffff" width={20} />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="AccountPasswordContainer"
          component={AccountPasswordContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('accountSection.menuList.password')}
              </Text>
            ),
          }}
        />

        <Stack.Screen
          name="GetPromotionsContainer"
          component={GetPromotionsContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('accountSection.menuList.getNotifications')}
              </Text>
            ),
          }}
        />

        <Stack.Screen
          name="ReportStoreDetailsContainer"
          component={ReportStoreDetailsContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('reportsSection.detailStore')}
              </Text>
            ),
          }}
        />

        <Stack.Screen
          name="ReportRemittanceDetailsContainer"
          component={ReportRemittanceDetailsContainer}
          options={{
            headerShown: true,
            gestureEnabled: false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: Colors.darkGreen,
            },
            headerShadowVisible: false,
            headerTintColor: Colors.white,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={[
                  { color: Colors.white, textAlign: 'left' },
                  themeStyles.regular16,
                ]}
              >
                {t('reportsSection.remittanceDetails')}
              </Text>
            ),
          }}
        />
      </Stack.Navigator>
    </ProfileProvider>
  );
};
