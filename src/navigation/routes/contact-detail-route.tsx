import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { useQueryClient } from 'react-query';
import { RootStackParamList } from '..';
import { SVGs } from '../../assets/svg';
import { ContactDetailContainer } from '../../containers/account';
import { QueryTypes } from '../../models';
import { useLoadingContext } from '../../providers/LoadingProvider';
import { useGlobalModalContext } from '../../providers/ModalProvider';
import { ContactService } from '../../services';
import { Colors } from '../../themes';
import { TabStackParamList } from '../tabs';

const Stack = createNativeStackNavigator<
  RootStackParamList & TabStackParamList
>();

type GenericSelectorModalProps = NativeStackScreenProps<
  RootStackParamList & TabStackParamList,
  'ContactDetailRoute'
>;

export const ContactDetailRoute = (props: GenericSelectorModalProps) => {
  const { showModal, hideModal } = useGlobalModalContext();
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const queryCache = useQueryClient();

  const goBack = () => {
    props.navigation.goBack();
  };

  const confirmDelete = () => {
    showModal({
      type: 'delete',
      title: t('contactSection.confirmDelete'),
      description: t('contactSection.deleteDescription'),
      onClose: (id) => {
        hideModal();

        if (id === 'delete') {
          deleteMegaContact();
        }
      },
    });
  };

  const deleteMegaContact = async () => {
    try {
      setLoading(true);
      await ContactService.deleteContact(props.route.params.phoneContact.id);

      queryCache.invalidateQueries(QueryTypes.GetContacts);
      props.navigation.navigate('Calls', {
        defaultPage: 'contactos',
      });
    } catch (err) {
      setLoading(false);
      console.log(err);

      showModal({
        type: 'error',
        title: t('error'),
        description: t('contactSection.errorDeleteContact'),
        buttons: [
          {
            id: 'retry',
            title: t('retry'),
            onPress: () => {
              hideModal();
            },
            variant: 'secondary',
          },
        ],
        onClose: (id?: string) => {
          if (id === 'retry') {
            deleteMegaContact();
          }
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const onEdit = () => {
    props.navigation.navigate('ContactEditionRoute', {
      isNewContact: false,
      editContact: props.route.params.megaContact!,
      acceptRemittance: props.route.params.acceptRemittance,
    });
  };

  const HeaderRight = ({ isMegaContact }: { isMegaContact: boolean }) => {
    return isMegaContact ? (
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity style={{ marginRight: 10 }} onPress={onEdit}>
          <SVGs.EditContactHeaderIcon width={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={confirmDelete}>
          <SVGs.DeleteContactHeaderIcon width={20} />
        </TouchableOpacity>
      </View>
    ) : undefined;
  };

  return (
    <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen
        name="ContactDetailContainer"
        component={ContactDetailContainer}
        initialParams={{
          isMegaContact: props.route.params.isMegaContact,
          megaContact: props.route.params.megaContact,
          phoneContact: props.route.params.phoneContact,
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
          headerTitle: t('details'),
          headerRight: () => (
            <HeaderRight isMegaContact={props.route.params.isMegaContact} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
