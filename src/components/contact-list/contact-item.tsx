import { toLower } from 'lodash';
import { memo } from 'react';
import {
  SectionListData,
  SectionListData as SectionListDataReact,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ContactPhone } from '../../models';
import { Colors } from '../../themes';
import { Flag, FontType, MegaText } from '../ui';

export type ContactItemProps = {
  item: ContactPhone;
  index: number;
  section: SectionListDataReact<ContactPhone, SectionListData<ContactPhone>>;
  isNautaOnly?: boolean;
  onSelectContact: (selected: ContactPhone) => void;
};

export const ContactItem = memo(
  ({
    item,
    index,
    section,
    isNautaOnly,
    onSelectContact,
  }: ContactItemProps) => {
    return (
      <TouchableOpacity onPress={() => onSelectContact(item)}>
        <View
          style={[
            styles.rowContainer,
            index === 0 && styles.rowContainerFirst,
            index === section.data.length - 1 && styles.rowContainerLast,
          ]}
        >
          <View>
            <View style={styles.initialContainer}>
              <MegaText
                size={20}
                font={FontType.medium}
                styles={{ lineHeight: 24, color: Colors.darkGreen }}
              >
                {item.initials}
              </MegaText>
            </View>
          </View>
          <View
            style={[
              styles.rowSecondHalfContainer,
              index === section.data.length - 1 &&
                styles.lastRowSecondHalfContainer,
            ]}
          >
            <View style={styles.middleRowContainer}>
              <View style={{ flexDirection: 'row' }}>
                <MegaText
                  size={16}
                  font={FontType.medium}
                  styles={{ lineHeight: 20, color: Colors.primary }}
                >
                  {item.fullName}
                </MegaText>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {item.countryCode && !isNautaOnly && (
                  <Flag
                    name={toLower(item.countryCode)}
                    styles={{ height: 20, width: 20, marginRight: 5 }}
                  />
                )}
                <MegaText
                  size={13}
                  styles={{ color: '#616161', lineHeight: 20 }}
                >
                  {isNautaOnly ? item.emailNauta : item.formattedPhone}
                </MegaText>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  initialContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    backgroundColor: '#E1EEE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainerFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowContainerLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowSecondHalfContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    marginLeft: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197, 197, 197, 0.5)',
  },
  lastRowSecondHalfContainer: {
    borderBottomWidth: 0,
  },
  middleRowContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
