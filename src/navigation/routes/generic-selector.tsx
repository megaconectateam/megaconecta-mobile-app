import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, TextInput, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '..';
import { SVGs } from '../../assets/svg';
import { GenericSelector } from '../../components';
import { setValue } from '../../store/features/countrySearchSlice';
import { useAppDispatch } from '../../store/hooks';
import { Colors, themeStyles } from '../../themes';

const Stack = createNativeStackNavigator<RootStackParamList>();

type GenericSelectorModalProps = NativeStackScreenProps<
  RootStackParamList,
  'GenericSelectorModal'
>;

export const GenericSelectorModal = ({
  route,
  navigation,
}: GenericSelectorModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    dispatch(setValue(text));
  };

  const onPressSearchVisible = () => {
    setSearchVisible(true);
    handleSearch('');
  };

  const goBack = () => {
    handleSearch('');
    navigation.goBack();
  };

  const lineHeight = Platform.select({
    ios: 0,
    android: 29,
  });

  return (
    <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen
        name="GenericSelector"
        component={GenericSelector}
        initialParams={route.params}
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
          headerRight: () =>
            !searchVisible ? (
              <TouchableOpacity onPress={() => onPressSearchVisible()}>
                <SVGs.SearchIcon width={20} />
              </TouchableOpacity>
            ) : undefined,
          // header
          headerTitle: searchVisible
            ? () => (
                <TextInput
                  placeholder={t('search')}
                  value={searchText}
                  onChangeText={handleSearch}
                  style={[
                    { flex: 1, color: Colors.white },
                    themeStyles.regular16,
                    {
                      lineHeight,
                    },
                  ]}
                  keyboardType="default"
                  placeholderTextColor={Colors.lighterGreen}
                  cursorColor={Colors.white}
                  autoFocus
                />
              )
            : () => (
                <Text style={[{ color: Colors.white }, themeStyles.regular16]}>
                  {t('select_option')}
                </Text>
              ),
        }}
      />
    </Stack.Navigator>
  );
};
