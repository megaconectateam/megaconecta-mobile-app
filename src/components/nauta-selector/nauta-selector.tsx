import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SVGs } from '../../assets/svg';
import { ContactPhone } from '../../models';
import { Colors, themeStyles } from '../../themes';
import { ellipsisNauta } from '../../utils';
import { ModalContactSelector } from '../modal-contact-selector';
import { FontType, MegaText } from '../ui';
import { ModalNautaInput } from './modal-nauta-input';

export type NautaSelectorProps = {
  onSelectedContact: (selected: ContactPhone | null) => void;
};

export const NautaSelector = ({ onSelectedContact }: NautaSelectorProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const [modalInputVisible, setModalInputVisible] = useState<boolean>(false);
  const [modalContactsVisible, setModalContactsVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactPhone | null>(
    null,
  );

  const modalInputOnSelect = (selected: ContactPhone) => {
    setSelectedContact(selected);
    setModalInputVisible(false);
    onSelectedContact(selected);
  };

  const modalContactOnSelect = (selected: ContactPhone) => {
    setSelectedContact(selected);
    setModalContactsVisible(false);
    onSelectedContact(selected);
  };

  const renderSelectedNauta = () => {
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
            Nauta
          </MegaText>
        </View>
        <View style={styles.containerFlagNumber}>
          <MegaText size={13} font={FontType.medium}>
            {ellipsisNauta(selectedContact.emailNauta || '', width)}
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
            <MegaText size={13} font={FontType.medium}>
              {ellipsisNauta(selectedContact.emailNauta || '', width)}
            </MegaText>
          </View>
        </View>
      </View>
    );
  };

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

            {renderSelectedNauta()}
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
            setModalInputVisible(true);
          }}
        >
          <SVGs.RecargarNautaIcon width={30} height={30} />
        </TouchableOpacity>
      </View>

      <ModalNautaInput
        isVisible={modalInputVisible}
        onClose={() => {
          setModalInputVisible(false);
        }}
        onSelected={modalInputOnSelect}
      />

      <ModalContactSelector
        isVisible={modalContactsVisible}
        isNautaOnly
        onClose={() => {
          setModalContactsVisible(false);
        }}
        onSelected={modalContactOnSelect}
      />
    </>
  );
};

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
