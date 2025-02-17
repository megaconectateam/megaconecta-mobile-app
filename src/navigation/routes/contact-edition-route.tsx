import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { RootStackParamList } from '..';
import { SVGs } from '../../assets/svg';
import { ContactEditionContainer } from '../../containers/account';
import { Colors } from '../../themes';
import { TabStackParamList } from '../tabs';

const Stack = createNativeStackNavigator<
  RootStackParamList & TabStackParamList
>();

type GenericSelectorModalProps = NativeStackScreenProps<
  RootStackParamList & TabStackParamList,
  'ContactEditionRoute'
>;

export const ContactEditionRoute = (props: GenericSelectorModalProps) => {
  const { t } = useTranslation();

  const goBack = () => {
    props.navigation.goBack();
  };

  return (
    <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen
        name="ContactEditionContainer"
        component={ContactEditionContainer}
        initialParams={{
          isNewContact: props.route.params.isNewContact,
          editContact: props.route.params.editContact,
          acceptRemittance: props.route.params.acceptRemittance,
        }}
        options={{
          headerShown: true,
          gestureEnabled: true,
          presentation: 'modal',
          headerStyle: {
            backgroundColor: Colors.darkGreen,
          },
          headerTintColor: Colors.white,
          headerTitleAlign: 'left',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={goBack}>
              <SVGs.BackIcon width={20} style={{ marginEnd: 10 }} />
            </TouchableOpacity>
          ),
          headerTitle: props.route.params.isNewContact
            ? t('contactSection.addContact')
            : t('contactSection.editContact'),
        }}
      />
    </Stack.Navigator>
  );
};
