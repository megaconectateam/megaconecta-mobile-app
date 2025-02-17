import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Contacts from 'expo-contacts';
import { compact, orderBy } from 'lodash';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useQuery } from 'react-query';
import { SVGs } from '../assets/svg';
import { ContactList, ContactPermissions } from '../components';
import { FontType, MegaButton, MegaInput, MegaText } from '../components/ui';
import {
  ContactPhone,
  MegaContact,
  MegaProfile,
  QueryTypes,
  SectionListData,
} from '../models';
import { RootStackParamList, TabStackParamList } from '../navigation';
import { useLoadingContext } from '../providers/LoadingProvider';
import { useGlobalModalContext } from '../providers/ModalProvider';
import { AccountServices, ContactService } from '../services';
import { Colors } from '../themes';
import { convertMegaContactToPhoneContact } from '../utils';

export type ContactosPageProps = {
  navigation: NativeStackNavigationProp<
    TabStackParamList & RootStackParamList,
    'Calls',
    undefined
  >;
};

export const ContactosPage = ({ navigation }: ContactosPageProps) => {
  const { showModal, hideModal } = useGlobalModalContext();
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();

  const [displayContactPermModal, setDisplayContactPermModal] = useState(false);
  const [contactPhone, setContactPhone] = useState<
    SectionListData<ContactPhone>[]
  >([]);
  const [contactMega, setContactMega] = useState<
    SectionListData<ContactPhone>[]
  >([]);
  const [filteredContactList, setFilteredContactList] = useState<
    SectionListData<ContactPhone>[]
  >([]);
  const [search, setSearch] = useState('');
  const [isReadyMega, setIsReadyMega] = useState(false);
  const [isReadyPhone, setIsReadyPhone] = useState(false);
  const [profile, setProfile] = useState<MegaProfile>({
    user: { accept_remittance: false },
  } as MegaProfile);
  const [megaContactList, setMegaContactList] = useState<MegaContact[]>([]);

  const contactQuery = useQuery(
    QueryTypes.GetContacts,
    ContactService.getContacts,
  );

  const profileQuery = useQuery(
    QueryTypes.GetProfile,
    AccountServices.getProfileData,
  );

  const getPermissions = async () => {
    try {
      const perm = await Contacts.getPermissionsAsync();

      if (
        perm.status === Contacts.PermissionStatus.UNDETERMINED &&
        perm.canAskAgain
      ) {
        setIsReadyPhone(true);
        setDisplayContactPermModal(true);
      } else if (perm.granted) {
        await loadContactPermissions();
      } else if (perm.status === Contacts.PermissionStatus.DENIED) {
        setIsReadyPhone(true);
        showModal({
          title: t('error'),
          onClose: () => {},
          type: 'error',
          description: t('contactSection.permissionDenied'),
          buttons: [
            {
              id: 'close',
              title: t('close'),
              onPress: () => {
                hideModal();
              },
              variant: 'secondary',
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
      setIsReadyPhone(true);

      if (!displayContactPermModal) {
        showModal({
          title: t('error'),
          onClose: () => {},
          type: 'error',
          description: t('contactSection.permissionsError'),
          buttons: [
            {
              id: 'close',
              title: t('close'),
              onPress: () => {
                hideModal();
              },
              variant: 'secondary',
            },
          ],
        });
      }
    }
  };

  const loadContactPermissions = async () => {
    setIsReadyPhone(false);

    const response = await ContactService.getPhoneContacts();

    if (response.success && response.data.length > 0) {
      setContactPhone(response.data);
      setIsReadyPhone(true);
    } else {
      setIsReadyPhone(true);
      showModal({
        type: 'error',
        title: t('error'),
        description: t('contactSection.errorPhone'),
        onClose: () => {
          hideModal();
        },
      });
    }
  };

  useEffect(() => {
    if (profileQuery.status === 'success' && profileQuery.data.user) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  useEffect(() => {
    if (isReadyMega && isReadyPhone) {
      setLoading(false);

      if (!search) {
        setFilteredContactList([...contactMega, ...contactPhone]);
      }
    } else {
      setLoading(true);
    }
  }, [isReadyMega, isReadyPhone]);

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    searchContact();
  }, [search]);

  useEffect(() => {
    searchContact();
  }, [contactMega]);

  const searchContact = () => {
    if (!search) {
      setFilteredContactList([...contactMega, ...contactPhone]);
      return;
    }

    const newContactMega = [...contactMega, ...contactPhone].map((c) => {
      const filter = c.data.filter((d) => {
        return (
          d.fullName.toLowerCase().includes(search.toLowerCase()) ||
          d.formattedPhone.includes(search)
        );
      });

      return filter.length > 0
        ? {
            ...c,
            data: filter,
          }
        : null;
    });

    setFilteredContactList(compact(newContactMega));
  };

  useEffect(() => {
    if (contactQuery.status === 'success' && contactQuery.data.length > 0) {
      setMegaContactList(contactQuery.data);
      const cArray: ContactPhone[] = contactQuery.data.map(
        convertMegaContactToPhoneContact,
      );

      setContactMega([
        { title: 'Megaconecta', data: orderBy(cArray, ['fullName', 'asc']) },
      ]);
      setIsReadyMega(true);
    } else if (contactQuery.status === 'error') {
      setIsReadyMega(true);

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
    let mContact = undefined;
    if (contact.isMegaconecta) {
      mContact = megaContactList.find((c) => c.id === Number(contact.id));
    }

    navigation.navigate('ContactDetailRoute', {
      isMegaContact: !!contact.isMegaconecta,
      phoneContact: contact,
      megaContact: mContact,
      acceptRemittance: profile.user.accept_remittance,
    });
  };

  const addContact = () => {
    navigation.navigate('ContactEditionRoute', {
      isNewContact: true,
      editContact: undefined,
      acceptRemittance: profile.user.accept_remittance,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundScreen }}>
      {contactPhone.length === 0 &&
        contactMega.length === 0 &&
        isReadyMega &&
        isReadyPhone && (
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
              source={require('../assets/animations/empty-contacts.json')}
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

      {(contactPhone.length > 0 || contactMega.length > 0) && (
        <>
          <View style={{ paddingTop: 20, paddingHorizontal: 16 }}>
            <MegaInput
              value={search}
              nativeProps={{
                keyboardType: 'default',
                placeholder: t('contactSection.searchContact'),
                placeholderTextColor: '#949494',
                autoCorrect: false,
                autoCapitalize: 'none',
              }}
              iconLeft={<SVGs.SearchContactIcon />}
              inputStyles={{
                backgroundColor: '#EEEEEE',
                borderRadius: 12,
                borderColor: '#EEEEEE',
                color: '#949494',
                fontSize: 16,
              }}
              onChangeText={setSearch}
            />
          </View>

          <View style={{ alignItems: 'flex-end', paddingHorizontal: 16 }}>
            <MegaButton
              text={t('contactSection.addContact')}
              variant="link"
              iconLeft={<SVGs.Payment.AddCircleIcon />}
              onPress={addContact}
            />
          </View>
        </>
      )}

      {(contactPhone.length > 0 || contactMega.length > 0) && (
        <ContactList
          contactList={filteredContactList}
          onSelectContact={onSelectContact}
        />
      )}

      <ContactPermissions
        isVisible={displayContactPermModal}
        onTapAction={(allowAccess) => {
          setDisplayContactPermModal(false);

          if (allowAccess) {
            loadContactPermissions();
          }
        }}
        onModalHide={() => {
          setDisplayContactPermModal(false);
        }}
      />
    </View>
  );
};
