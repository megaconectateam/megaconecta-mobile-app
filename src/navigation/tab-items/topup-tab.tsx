import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import { SVGs } from '../../assets/svg';
import { HeaderBalance, TopupCartIcon } from '../../components';
import {
  TopupCartContainer,
  TopupContainer,
  TopupMobileContainer,
  TopupNautaContainer,
} from '../../containers/account';
import { useTopup } from '../../providers';
import { Colors, themeStyles } from '../../themes';

export type TopupStackParamList = {
  TopupNautaContainer: undefined;
  TopupMobileContainer: undefined;
  TopupContainer: undefined;
  TopupCartContainer: undefined;
};

const Stack = createNativeStackNavigator<TopupStackParamList>();

export const TopupTabNavigation = () => {
  const { t } = useTranslation();
  const { cartItems } = useTopup();

  return (
    <Stack.Navigator
      initialRouteName="TopupContainer"
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: 'push',
        gestureEnabled: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="TopupContainer"
        component={TopupContainer}
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
          headerLeft: () => <HeaderBalance />,
          headerTitle: '',
        }}
      />

      <Stack.Screen
        name="TopupNautaContainer"
        component={TopupNautaContainer}
        options={({ navigation }) => ({
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
              {t('topupNauta')}
            </Text>
          ),
        })}
      />

      <Stack.Screen
        name="TopupMobileContainer"
        component={TopupMobileContainer}
        options={({ navigation }) => ({
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
              {t('topupCellphone')}
            </Text>
          ),
          headerRight: () => (
            <TopupCartIcon
              onPress={() => {
                if (cartItems.length > 0) {
                  navigation.navigate('TopupCartContainer');
                }
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="TopupCartContainer"
        component={TopupCartContainer}
        options={({ navigation }) => ({
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
              {t('topupSection.cartPage', { count: cartItems.length })}
            </Text>
          ),
        })}
      />
    </Stack.Navigator>
  );
};
