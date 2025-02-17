import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import {
  SectionList,
  SectionListData,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { LottieResources } from '../../assets/animations';
import { SVGs } from '../../assets/svg';
import { ContactPhone } from '../../models';
import { Colors } from '../../themes';
import { FontType, MegaText } from '../ui';
import { ContactItem } from './contact-item';

export type ContactListProps = {
  contactList: SectionListData<ContactPhone>[];
  onSelectContact: (selected: ContactPhone) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  disableScroll?: boolean;
  isNautaOnly?: boolean;
  disableHeaders?: boolean;
};

export const ContactList = ({
  contactList,
  onSelectContact,
  contentContainerStyle,
  disableScroll,
  isNautaOnly,
  disableHeaders,
}: ContactListProps) => {
  const { t } = useTranslation();

  return (
    <SectionList
      sections={contactList}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index, section }) => (
        <ContactItem
          item={item}
          index={index}
          section={section}
          isNautaOnly={isNautaOnly}
          onSelectContact={onSelectContact}
        />
      )}
      stickySectionHeadersEnabled={false}
      scrollEnabled={!disableScroll}
      renderSectionHeader={({ section: { title } }) => {
        if (disableHeaders) return null;

        return (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: 5,
              marginTop: 16,
              backgroundColor: '#f9f9f9',
            }}
          >
            <View style={{ marginRight: 5 }}>
              {title === 'Megaconecta' && <SVGs.GrayStarIcon />}
            </View>

            <View style={{ flexGrow: 1 }}>
              <MegaText
                size={13}
                font={FontType.medium}
                styles={{ lineHeight: 24, color: '#8F979F' }}
              >
                {title}
              </MegaText>
            </View>
          </View>
        );
      }}
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.sectionContainer,
        !!contentContainerStyle && contentContainerStyle,
        contactList.length === 0 && { flexGrow: 1 },
      ]}
      ListEmptyComponent={() => (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '30%',
          }}
        >
          <LottieView
            autoPlay
            style={{
              width: 150,
              height: 150,
            }}
            source={LottieResources.emptyContacts}
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
            {t('contactSection.noContactsSelectedCountry')}
          </MegaText>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: Colors.backgroundScreen,
  },
});
