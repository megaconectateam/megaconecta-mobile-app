import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { SVGs } from '../../assets/svg';
import { GenericList } from '../../models/genericList';
import { RootStackParamList } from '../../navigation';
import { setValue } from '../../store/features/countrySearchSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Colors, themeStyles } from '../../themes';
import { Flag, FontType, MegaLabel, MegaText } from '../ui';

type CountrySelectorProps = {
  countryList: GenericList[];
  selectedCountry?: string;
  labelBackgroundColor?: string;
  hasShadow?: boolean;
  hideLabel?: boolean;
  isDisabled?: boolean;

  onPress?: () => void;
  onSelectCountry: (country: GenericList) => void;
};

export const CountrySelectorInput = (props: CountrySelectorProps) => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selectedItem, setSelectedItem] = useState<GenericList | null>(null);

  useEffect(() => {
    if (props.selectedCountry) {
      setSelectedItem(
        props.countryList.find((item) => item.value === props.selectedCountry)!,
      );
    }
  }, [props.selectedCountry]);

  const handleSelectItem = (item: GenericList) => {
    setSelectedItem(item);
    props.onSelectCountry(item);
  };

  return (
    <TouchableOpacity
      activeOpacity={props.isDisabled ? 1 : 0.5}
      onPress={() => {
        if (props.isDisabled) return;

        props.onPress && props.onPress();
        navigation.navigate('CountrySelectorModal', {
          onSelectItem: handleSelectItem,
          countryList: props.countryList,
        });
      }}
    >
      <View
        style={[stylesInput.input, !!props.hasShadow && themeStyles.shadow]}
      >
        <View>
          {!!selectedItem && (
            <Flag
              name={selectedItem.value}
              styles={{ width: 20, height: 20 }}
            />
          )}
        </View>
        <View style={stylesInput.midRow}>
          <MegaText styles={{ marginStart: 10, lineHeight: 27 }} size={16}>
            {selectedItem ? selectedItem.label : t('select_country')}
          </MegaText>
        </View>
        <View>
          <SVGs.ArrowInput width={15} />
        </View>
      </View>
      {!props.hideLabel && (
        <View
          style={[
            stylesInput.labelContainer,
            !!props.labelBackgroundColor && {
              backgroundColor: props.labelBackgroundColor,
            },
          ]}
        >
          <MegaLabel>{t('country')}</MegaLabel>
        </View>
      )}
    </TouchableOpacity>
  );
};

const stylesInput = StyleSheet.create({
  input: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    height: 55,
    width: '100%',
    borderRadius: 6,
    backgroundColor: Colors.white,
    borderColor: Colors.borderInput,
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  midRow: {
    display: 'flex',
    flex: 1,
  },
  labelContainer: {
    position: 'absolute',
    left: 15,
    top: -13,
    backgroundColor: Colors.white,
  },
});

type Props = NativeStackScreenProps<RootStackParamList, 'CountrySelector'>;

export const CountrySelector = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const {
    onSelectItem,
    countryList,
  }: { countryList: GenericList[]; onSelectItem: Function } = route.params;
  const [filteredList, setFilteredList] = useState<GenericList[]>([
    ...countryList,
  ]);

  const searchTerm = useAppSelector((state) => state.countrySearch.search);

  const handleSelectItem = (item: GenericList) => {
    onSelectItem(item);
    dispatch(setValue(''));
    navigation.goBack();
  };

  useEffect(() => {
    setFilteredList(countryList);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredList(countryList);
    } else {
      const filtered = countryList.filter((item: GenericList) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredList(filtered);
    }
  }, [searchTerm]);

  const renderItem = ({
    item,
    index,
  }: {
    item: GenericList;
    index: number;
  }) => (
    <TouchableOpacity onPress={() => handleSelectItem(item)}>
      <View
        style={[
          stylesList.listItem,
          index === filteredList.length - 1
            ? stylesList.listItemNoBorder
            : undefined,
        ]}
      >
        <View style={stylesList.listItemRow}>
          <Flag name={item.value} styles={{ width: 20, height: 20 }} />
        </View>
        <View style={[stylesList.listItemRow, stylesList.midRow]}>
          <MegaText>{item.label}</MegaText>
        </View>
        <View style={stylesList.listItemRow}>
          <MegaText
            styles={{ color: Colors.darkerGreen }}
            font={FontType.medium}
          >
            {item.extraLabel}
          </MegaText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={stylesList.listContainer}>
      <FlatList
        data={filteredList}
        renderItem={renderItem}
        keyExtractor={(item) => item.value}
        style={stylesList.flatList}
      />
    </View>
  );
};

const stylesList = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
    padding: 20,
  },
  flatList: {
    borderRadius: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
  },
  listItem: {
    display: 'flex',
    paddingVertical: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#c5c5c5',
  },
  listItemNoBorder: {
    borderBottomWidth: 0,
  },
  listItemRow: {
    display: 'flex',
    marginStart: 10,
  },
  midRow: {
    display: 'flex',
    flex: 1,
  },
});
