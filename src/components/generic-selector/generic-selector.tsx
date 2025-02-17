import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { GenericList } from '../../models';
import { RootStackParamList } from '../../navigation';
import { setValue } from '../../store/features/countrySearchSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Colors, themeStyles } from '../../themes';
import { FontType, MegaLabel, MegaText } from '../ui';

export type GenericSelectorProps = {
  itemList: GenericList[];
  selectedItem?: GenericList;
  label?: string;
  placeholder?: string;
  hasShadow?: boolean;

  onOpenSelector?: () => void;
  onSelectItem: (item: GenericList) => void;
};

export const GenericSelectorInput = (props: GenericSelectorProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selectedItem, setSelectedItem] = useState<GenericList | null>(
    props.selectedItem || null,
  );

  const handleSelectItem = (item: GenericList) => {
    setSelectedItem(item);
    props.onSelectItem(item);
  };

  useEffect(() => {
    setSelectedItem(props.selectedItem || null);
  }, [props.selectedItem]);

  return (
    <TouchableOpacity
      disabled={props.itemList.length === 0}
      onPress={() => {
        if (props.itemList.length === 0) {
          return;
        }

        props.onOpenSelector && props.onOpenSelector();

        navigation.navigate('GenericSelectorModal', {
          onSelectItem: handleSelectItem,
          itemList: props.itemList,
        });
      }}
      style={[!!props.hasShadow && themeStyles.shadow]}
    >
      <View style={stylesInput.input}>
        {selectedItem?.icon && (
          <View style={stylesInput.icon}>{selectedItem.icon}</View>
        )}
        <View style={stylesInput.midRow}>
          <MegaText styles={{ lineHeight: 27 }} size={16}>
            {!!selectedItem ? selectedItem.label : props.placeholder || ''}
          </MegaText>
        </View>
        <View>
          <SVGs.ArrowInput width={15} />
        </View>
      </View>
      {props.label && (
        <View style={stylesInput.labelContainer}>
          <MegaLabel>{props.label}</MegaLabel>
        </View>
      )}
    </TouchableOpacity>
  );
};

const stylesInput = StyleSheet.create({
  icon: {
    marginRight: 10,
  },
  input: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    height: 55,
    width: '100%',
    borderRadius: 12,
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

type Props = NativeStackScreenProps<RootStackParamList, 'GenericSelector'>;

export const GenericSelector = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const {
    onSelectItem,
    itemList,
  }: { itemList: GenericList[]; onSelectItem: Function } = route.params;
  const [filteredList, setFilteredList] = useState<GenericList[]>([
    ...itemList,
  ]);

  const searchTerm = useAppSelector((state) => state.countrySearch.search);

  const handleSelectItem = (item: GenericList) => {
    onSelectItem(item);
    dispatch(setValue(''));
    navigation.goBack();
  };

  useEffect(() => {
    setFilteredList(itemList);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredList(itemList);
    } else {
      const filtered = itemList.filter((item: GenericList) =>
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
        <View style={[stylesList.listItemRow, stylesList.midRow]}>
          <MegaText>{item.label}</MegaText>
        </View>
        <View style={stylesList.listItemRow}>
          {!item.icon && (
            <MegaText
              styles={{ color: Colors.darkerGreen }}
              font={FontType.medium}
            >
              {item.extraLabel}
            </MegaText>
          )}
          {item.icon && item.icon}
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
    justifyContent: 'center',
  },
});
