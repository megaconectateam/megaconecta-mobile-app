import { toLower } from 'lodash';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { ContactPhone, GenericList } from '../../models';
import { Colors, themeStyles } from '../../themes';
import { ModalContactSelector } from '../modal-contact-selector';
import { ModalDialer } from '../modal-dialer';
import { Flag, FontType, MegaText } from '../ui';

export type ContactSelectorProps = {
  contactCountry: GenericList;
  onSelectedContact: (selected: ContactPhone | null) => void;
  source?: 'topup' | 'referral';
};

export type ContactSelectorRef = {
  resetContact: () => void;
};

const ContactSelectorComponent = (props: ContactSelectorProps, ref: any) => {
  const { t } = useTranslation();

  const [modalDialerVisible, setModalDialerVisible] = useState(false);
  const [modalContactsVisible, setModalContactsVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactPhone | null>(
    null,
  );
  const [country, setCountry] = useState<GenericList>(props.contactCountry);

  useEffect(() => {
    if (props.contactCountry) {
      setCountry(props.contactCountry);
      setSelectedContact(null);
      props.onSelectedContact(null);
    }
  }, [props.contactCountry]);

  const modalDialerOnSelect = (selected: ContactPhone) => {
    setSelectedContact(selected);
    setModalDialerVisible(false);
    props.onSelectedContact(selected);
  };

  const modalContactOnSelect = (selected: ContactPhone) => {
    setSelectedContact(selected);
    setModalContactsVisible(false);
    props.onSelectedContact(selected);
  };

  const renderSelectedNumber = () => {
    if (!selectedContact) {
      return null;
    }

    if (selectedContact.id !== '-1') {
      return null;
    }

    return (
      <View style={styles.containerNumber}>
        <View>
          <MegaText size={16} font={FontType.medium}>
            {t('number')}
          </MegaText>
        </View>
        <View style={styles.containerFlagNumber}>
          <Flag
            name={selectedContact.countryCode || ''}
            styles={{ width: 20, height: 20, marginEnd: 5 }}
          />

          <MegaText size={13} font={FontType.medium}>
            {selectedContact.formattedPhone}
          </MegaText>
        </View>
      </View>
    );
  };

  const renderSelectedContact = () => {
    if (!selectedContact) {
      return null;
    }

    if (selectedContact.id === '-1') {
      return null;
    }

    return (
      <View style={styles.containerContact}>
        <View style={styles.initialsContainer}>
          <MegaText
            size={20}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.darkGreen }}
          >
            {selectedContact.initials}
          </MegaText>
        </View>

        <View style={{ flexDirection: 'column' }}>
          <View>
            <MegaText size={16} font={FontType.medium}>
              {selectedContact.fullName}
            </MegaText>
          </View>
          <View style={styles.containerFlagNumber}>
            <Flag
              name={toLower(selectedContact.countryCode) || ''}
              styles={{ width: 20, height: 20, marginEnd: 5 }}
            />

            <MegaText size={13} font={FontType.medium}>
              {selectedContact.formattedPhone}
            </MegaText>
          </View>
        </View>
      </View>
    );
  };

  useImperativeHandle(ref, () => ({
    resetContact: () => {
      setSelectedContact(null);
      props.onSelectedContact(null);
    },
  }));

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[styles.itemWrapper, styles.contactWrapper]}
          onPress={() => {
            setModalContactsVisible(true);
          }}
        >
          <View>
            {!selectedContact && (
              <View style={styles.containerNoContact}>
                <SVGs.SelectContactIcon
                  width={30}
                  height={30}
                  style={{ marginRight: 5 }}
                />

                <MegaText size={13} font={FontType.medium}>
                  {t('selectContact')}
                </MegaText>
              </View>
            )}

            {renderSelectedNumber()}
            {renderSelectedContact()}
          </View>
          <View>
            <SVGs.ArrowListItem width={23} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.itemWrapper}
          onPress={() => {
            setModalDialerVisible(true);
          }}
        >
          <SVGs.DialerIcon width={30} height={30} />
        </TouchableOpacity>
      </View>

      <ModalDialer
        isVisible={modalDialerVisible}
        onClose={() => {
          setModalDialerVisible(false);
        }}
        onSelected={modalDialerOnSelect}
        defaultCountry={props.contactCountry}
        enforceDefaultCountry
        source={props.source || 'topup'}
      />

      <ModalContactSelector
        isVisible={modalContactsVisible}
        isNautaOnly={false}
        contactCountry={country}
        onClose={() => {
          setModalContactsVisible(false);
        }}
        onSelected={modalContactOnSelect}
      />
    </>
  );
};

export const ContactSelector = forwardRef<
  ContactSelectorRef,
  ContactSelectorProps
>(ContactSelectorComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  contactWrapper: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  itemWrapper: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    ...themeStyles.shadow,
  },
  containerNoContact: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerNumber: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  containerFlagNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerContact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  initialsContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    backgroundColor: '#E1EEE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
