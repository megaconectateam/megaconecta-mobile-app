import { compact, toLower } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  SectionListData,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useQuery } from 'react-query';
import { SVGs } from '../../assets/svg';
import {
  ContactPhone,
  GenericList,
  MegaContact,
  QueryTypes,
} from '../../models';
import { ContactService } from '../../services';
import { Colors } from '../../themes';
import { convertMegaContactToPhoneContact } from '../../utils';
import { ContactList } from '../contact-list';
import { FontType, MegaInput, MegaText } from '../ui';

export type ModalContactSelectorProps = {
  isVisible: boolean;
  isNautaOnly?: boolean;
  contactCountry?: GenericList;

  onClose: () => void;
  onSelected: (selected: ContactPhone) => void;
};

export const ModalContactSelector = (props: ModalContactSelectorProps) => {
  const { t } = useTranslation();

  const [scrollOffset, setScrollOffset] = useState();
  const [phoneContacts, setPhoneContacts] = useState<
    SectionListData<ContactPhone>[]
  >([]);
  const [megaContactList, setMegaContactList] = useState<MegaContact[]>([]);
  const [megaContacts, setMegaContacts] = useState<
    SectionListData<ContactPhone>[]
  >([]);
  const [filteredContacts, setFilteredContacts] = useState<
    SectionListData<ContactPhone>[]
  >([]);
  const [isReadyMega, setIsReadyMega] = useState(false);
  const [isReadyPhone, setIsReadyPhone] = useState(false);
  const [search, setSearch] = useState('');

  const contactQuery = useQuery(
    [QueryTypes.GetContacts, props.contactCountry],
    ContactService.getContacts,
  );

  useEffect(() => {
    if (contactQuery.status === 'success' && contactQuery.data.length > 0) {
      const tmpContacts = contactQuery.data.filter((c) => {
        if (props.isNautaOnly) {
          return !!c.email;
        }

        if (props.contactCountry) {
          return (
            props.contactCountry.value.toLocaleLowerCase() ===
            toLower(c.country_code)
          );
        }

        return true;
      });
      setMegaContactList(tmpContacts);
      const contacts = tmpContacts.map(convertMegaContactToPhoneContact);
      const contactList: SectionListData<ContactPhone> = {
        title: 'Megaconecta',
        data: contacts,
      };
      setMegaContacts(contacts.length > 0 ? [contactList] : []);
      setIsReadyMega(true);
    }
  }, [contactQuery.data]);

  useEffect(() => {
    if (props.isVisible) {
      getPhoneContacts(props.contactCountry);
    }
  }, [props.contactCountry, props.isVisible]);

  useEffect(() => {
    if (isReadyMega && isReadyPhone) {
      const contactList = [...megaContacts, ...phoneContacts];
      setFilteredContacts(contactList);
    }
  }, [isReadyMega, isReadyPhone]);

  useEffect(() => {
    searchContacts();
  }, [search]);

  const getPhoneContacts = useCallback(
    async (country?: GenericList) => {
      setPhoneContacts([]);
      setIsReadyPhone(false);

      const contacts = await ContactService.getPhoneContacts(
        props.isNautaOnly,
        country ? [country.value] : undefined,
      );

      if (contacts && contacts.success && contacts.data.length > 0) {
        setPhoneContacts(contacts.data);
      } else {
        setPhoneContacts([]);
      }

      setIsReadyPhone(true);
    },
    [props.isNautaOnly, props.contactCountry],
  );

  const scrollViewRef = useRef<ScrollView | null>(null);
  const handleScrollTo = (p: any) => {
    if (scrollViewRef && scrollViewRef?.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const handleOnScroll = (e: any) => {
    setScrollOffset(e.nativeEvent.contentOffset.y);
  };

  const onSelectContact = (contact: ContactPhone) => {
    props.onSelected(contact);
    setSearch('');
  };

  const searchContacts = (): void => {
    if (!search) {
      setFilteredContacts([...megaContacts, ...phoneContacts]);
      return;
    }

    const newList = [...megaContacts, ...phoneContacts].map((c) => {
      const filterList = c.data.filter((d) => {
        const hasExtraData = props.isNautaOnly
          ? d.emailNauta?.includes(search)
          : d.formattedPhone.includes(search);

        return (
          d.fullName.toLowerCase().includes(search.toLowerCase()) ||
          hasExtraData
        );
      });

      return filterList.length > 0 ? { ...c, data: filterList } : null;
    });

    setFilteredContacts(compact(newList));
  };

  return (
    <Modal
      isVisible={props.isVisible}
      scrollHorizontal={false}
      scrollOffsetMax={700 - 600}
      style={styles.view}
      scrollOffset={scrollOffset}
      scrollTo={handleScrollTo}
      propagateSwipe
    >
      <View style={styles.content}>
        <View style={{ paddingHorizontal: 30 }}>
          <View style={{ alignItems: 'center', position: 'relative' }}>
            <View>
              <MegaText
                size={18}
                font={FontType.medium}
                styles={{
                  lineHeight: 21,
                  color: Colors.primary,
                  textAlign: 'center',
                }}
              >
                {t('selectContact')}
              </MegaText>
            </View>
            <View style={{ position: 'absolute', top: -5, right: 0 }}>
              <TouchableOpacity
                onPress={() => props.onClose()}
                style={{
                  padding: 5,
                  width: 25,
                  height: 25,
                }}
              >
                <SVGs.CloseIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {(megaContactList.length > 0 || phoneContacts.length > 0) && (
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
        )}

        <ScrollView
          ref={scrollViewRef}
          scrollEventThrottle={400}
          onScroll={handleOnScroll}
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <ContactList
            contactList={filteredContacts}
            onSelectContact={onSelectContact}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            disableScroll
            isNautaOnly={props.isNautaOnly}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    backgroundColor: Colors.backgroundScreen,
    height: '90%',
    zIndex: 1000,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
});
