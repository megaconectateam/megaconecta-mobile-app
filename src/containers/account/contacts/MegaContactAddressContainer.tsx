import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { orderBy } from 'lodash';
import LottieView from 'lottie-react-native';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionListData, View } from 'react-native';
import { useQuery } from 'react-query';
import { ContactList } from '../../../components';
import { FontType, MegaButton, MegaText } from '../../../components/ui';
import { ContactPhone, MegaContact, QueryTypes } from '../../../models';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { useGlobalModalContext, useLoadingContext } from '../../../providers';
import { ProfileContext } from '../../../providers/ProfileProvider';
import { ContactService } from '../../../services';
import { Colors } from '../../../themes';
import { convertMegaContactToPhoneContact } from '../../../utils';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'MegaContactAddressContainer'
>;

export const MegaContactAddressContainer = ({ navigation }: Props) => {
  const { showModal, hideModal } = useGlobalModalContext();
  const { t } = useTranslation();
  const { setLoading, isLoading } = useLoadingContext();
  const { profile } = useContext(ProfileContext);

  const [contactMega, setContactMega] = useState<
    SectionListData<ContactPhone>[]
  >([]);
  const [megaContactList, setMegaContactList] = useState<MegaContact[]>([]);

  const contactQuery = useQuery(
    QueryTypes.GetContacts,
    () => {
      setLoading(true);
      return ContactService.getContacts();
    },
    {
      onSettled: () => {
        setLoading(false);
      },
    },
  );

  useEffect(() => {
    if (contactQuery.status === 'success' && contactQuery.data.length > 0) {
      setMegaContactList(contactQuery.data);
      const cArray: ContactPhone[] = contactQuery.data.map(
        convertMegaContactToPhoneContact,
      );

      setContactMega([
        { title: 'Megaconecta', data: orderBy(cArray, ['fullName', 'asc']) },
      ]);
      // setIsReadyMega(true);
    } else if (contactQuery.status === 'error') {
      // setIsReadyMega(true);

      showModal({
        type: 'error',
        title: t('error'),
        description: t('contactSection.errorMega'),
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
        onClose: (id?: string | undefined) => {
          if (id === 'retry') {
            contactQuery.refetch();
          }
        },
      });
    }
  }, [contactQuery.data]);

  const onSelectContact = (contact: ContactPhone) => {
    const mContact = megaContactList.find((c) => c.id === Number(contact.id));

    navigation.navigate('ContactDetailRoute', {
      isMegaContact: !!contact.isMegaconecta,
      phoneContact: contact,
      megaContact: mContact,
      acceptRemittance: !!profile?.user.accept_remittance,
    });
  };

  const addContact = () => {
    navigation.navigate('ContactEditionRoute', {
      isNewContact: true,
      editContact: undefined,
      acceptRemittance: !!profile?.user.accept_remittance,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.backgroundScreen,
        paddingTop: 20,
      }}
    >
      {contactMega.length === 0 && !isLoading && (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LottieView
            autoPlay
            style={{
              width: 150,
              height: 150,
            }}
            source={require('../../../assets/animations/empty-contacts.json')}
          />

          <MegaText
            size={16}
            font={FontType.medium}
            styles={{ lineHeight: 21, color: '#5F6368', marginTop: 10 }}
          >
            {t('contactSection.noContacts')}
          </MegaText>
          <MegaText
            size={13}
            styles={{ lineHeight: 18, color: '#949494', marginTop: 10 }}
          >
            {t('contactSection.addContactToCall')}
          </MegaText>
          <MegaButton
            variant="link"
            text={t('contactSection.addContact')}
            onPress={addContact}
          />
        </View>
      )}

      {contactMega.length > 0 && (
        <ContactList
          contactList={contactMega}
          onSelectContact={onSelectContact}
          disableHeaders
        />
      )}
    </View>
  );
};
