import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { toLower } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useQuery, useQueryClient } from 'react-query';
import {
    GenericSelectorInput,
    InputCountrySelector,
    InputNauta,
} from '../../../components';
import { FontType, MegaButton, MegaInput, MegaText } from '../../../components/ui';
import { GenericList, MegaContact, QueryTypes } from '../../../models';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { useLoadingContext } from '../../../providers/LoadingProvider';
import { useGlobalModalContext } from '../../../providers/ModalProvider';
import {
    ContactService,
    CountryServices,
    LocationServices,
    RemittanceService,
} from '../../../services';
import { Colors } from '../../../themes';
import {
    convertContactCountryToGenericList,
    convertLocationToGenericList,
} from '../../../utils';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'ContactEditionContainer'
>;

type ContactError = {
  firstName: string;
  lastName: string;
  phone: string;
  carnet: string;
  mlc: string;
};

const NEW_CONTACT = {
  id: -1,
  first_name: '',
  last_name: '',
  contact_name: '',
  contact_number: '',
  email: '',
  address: '',
  country_code: '',
  province_id: undefined,
  province_name: undefined,
  municipality_id: undefined,
  municipality_name: undefined,
  town: '',
  mlc_card: '',
  carnet: '',
};

export const ContactEditionContainer = ({ navigation, route }: Props) => {
  const { isNewContact, acceptRemittance, editContact } = route.params;
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const queryCache = useQueryClient();
  const { showModal, hideModal } = useGlobalModalContext();

  const [countryList, setCountryList] = useState<GenericList[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<GenericList | null>(
    null,
  );
  const [provinceList, setProvinceList] = useState<GenericList[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<GenericList | null>(
    null,
  );
  const [municipalityList, setMunicipalityList] = useState<GenericList[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<GenericList | null>(null);
  const [error, setError] = useState<ContactError>({
    firstName: '',
    lastName: '',
    phone: '',
    carnet: '',
    mlc: '',
  });
  const [contact, setContact] = useState<MegaContact>(
    isNewContact
      ? NEW_CONTACT
      : {
          ...editContact!,
          first_name: editContact!.first_name || editContact!.contact_name,
        },
  );

  const countryQuery = useQuery(
    QueryTypes.GetCountriesForContact,
    CountryServices.getAllCountriesForContacts,
  );

  const provinceQuery = useQuery(
    QueryTypes.GetStoreProvinces,
    LocationServices.getProvinces,
  );

  const municipalitiesQuery = useQuery(
    [QueryTypes.GetStoreMunicipalities, selectedProvince],
    () => {
      if (selectedProvince) {
        return LocationServices.getMunicipalities(selectedProvince.value);
      }

      return [];
    },
  );

  useEffect(() => {
    if (countryQuery.data?.length && !selectedCountry) {
      const defaultCountryCode = isNewContact
        ? 'cu'
        : toLower(editContact!.country_code);

      const defaultCountry = countryQuery.data.find(
        (i) => i.countcod?.toLowerCase() === (defaultCountryCode || 'cu'),
      );

      setSelectedCountry(
        convertContactCountryToGenericList(
          defaultCountry || countryQuery.data[0],
        ),
      );

      setCountryList(countryQuery.data.map(convertContactCountryToGenericList));
    }
  }, [countryQuery.data]);

  useEffect(() => {
    if (provinceQuery.data?.length && provinceQuery.status === 'success') {
      const pList = provinceQuery.data.map(convertLocationToGenericList);
      setProvinceList(pList);

      if (!isNewContact && editContact?.province_id) {
        const defaultProvince = pList.find(
          (i) => Number(i.value) === editContact?.province_id,
        );
        setSelectedProvince(defaultProvince || null);
      }
    }
  }, [provinceQuery.data]);

  useEffect(() => {
    if (
      municipalitiesQuery.data?.length &&
      municipalitiesQuery.status === 'success'
    ) {
      const mList = municipalitiesQuery.data.map(convertLocationToGenericList);
      setMunicipalityList(mList);

      if (!isNewContact && editContact?.municipality_id) {
        const defaultMunicipality = mList.find(
          (i) => Number(i.value) === editContact?.municipality_id,
        );
        setSelectedMunicipality(defaultMunicipality || null);
      }
    }
  }, [municipalitiesQuery.data, municipalitiesQuery.status]);

  const isValidData = async () => {
    if (!contact.contact_number) {
      setError({ ...error, phone: t('contactSection.validations.phone') });
      return false;
    }

    if (!contact.first_name) {
      setError({ ...error, firstName: t('contactSection.validations.name') });
      return false;
    }

    if (!contact.last_name) {
      setError({
        ...error,
        lastName: t('contactSection.validations.lastName'),
      });
      return false;
    }

    if (contact.mlc_card) {
      if (!(await validateMlcCard(contact.mlc_card))) {
        return false;
      }
    }

    return true;
  };

  const validateMlcCard = async (number: string) => {
    try {
      setLoading(true);

      const isValid = await RemittanceService.validateMlc(number);

      setLoading(false);

      if (!isValid) {
        setError({
          ...error,
          mlc: t('contactSection.validations.mlcCard'),
        });
        return false;
      }

      return true;
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError({
        ...error,
        mlc: t('contactSection.validations.mlc'),
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!(await isValidData())) {
      return;
    }

    if (isNewContact) {
      addNewContact();
    } else {
      updateContact();
    }
  };

  const addNewContact = async () => {
    const countryCode = toLower(selectedCountry!.value);
    const isCuba = countryCode === 'cu';

    try {
      setLoading(true);
      const response = await ContactService.createContact(
        contact.first_name,
        contact.last_name,
        selectedCountry!.value,
        `${selectedCountry!.extraLabel}${contact.contact_number}`,
        isCuba ? contact.email : undefined,
        isCuba ? contact.address : undefined,
        selectedProvince && isCuba ? selectedProvince.value : undefined,
        selectedMunicipality && isCuba ? selectedMunicipality.value : undefined,
        isCuba ? contact.town : undefined,
        isCuba ? contact.carnet : undefined,
        isCuba ? contact.mlc_card : undefined,
      );

      setLoading(false);
      if (response.success) {
        setContact(NEW_CONTACT);
        setSelectedCountry(null);
        setSelectedProvince(null);
        setSelectedMunicipality(null);

        queryCache.invalidateQueries(QueryTypes.GetContacts);
        navigation.navigate('Calls', {
          defaultPage: 'contactos',
        });
      } else if (response.isDuplicated) {
        setError({
          ...error,
          phone: t('contactSection.validations.duplicatedPhone'),
        });

        showModal({
          type: 'error',
          title: t('error'),
          description: t('contactSection.validations.duplicatedPhone'),
          buttons: [
            {
              id: 'change',
              title: t('contactSection.changePhone'),
              onPress: () => {
                hideModal();
              },
              variant: 'secondary',
            },
          ],
          onClose: () => {},
        });
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async () => {
    const countryCode = toLower(selectedCountry!.value);
    const isCuba = countryCode === 'cu';

    try {
      setLoading(true);

      const response = await ContactService.editContact(
        contact!.id,
        contact.first_name,
        contact.last_name,
        isCuba ? contact.email : undefined,
        isCuba ? contact.address : undefined,
        selectedProvince && isCuba ? selectedProvince.value : undefined,
        selectedMunicipality && isCuba ? selectedMunicipality.value : undefined,
        isCuba ? contact.town : undefined,
        isCuba ? contact.carnet : undefined,
        isCuba ? contact.mlc_card : undefined,
      );

      setLoading(false);

      if (response.success) {
        queryCache.invalidateQueries(QueryTypes.GetContacts);
        navigation.navigate('Calls', {
          defaultPage: 'contactos',
        });
      } else {
        showModal({
          type: 'error',
          title: t('error'),
          description: t('no_expected_error_try_again'),
          buttons: [
            {
              id: 'change',
              title: t('close'),
              onPress: () => {
                hideModal();
              },
              variant: 'secondary',
            },
          ],
          onClose: () => {},
        });
      }
    } catch (e) {
      setLoading(false);

      showModal({
        type: 'error',
        title: t('error'),
        description: t('no_expected_error_try_again'),
        buttons: [
          {
            id: 'change',
            title: t('close'),
            onPress: () => {
              hideModal();
            },
            variant: 'secondary',
          },
        ],
        onClose: () => {},
      });
    }
  };

  return (
    <ScrollView
      style={{ paddingHorizontal: 16, backgroundColor: Colors.white }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <SafeAreaView>
        <View style={{ paddingVertical: 20 }}>
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{
              lineHeight: 21,
              color: Colors.primary,
            }}
          >
            {t('contactSection.personalData')}
          </MegaText>
        </View>

        <View style={{ marginBottom: 16 }}>
          <MegaInput
            nativeProps={{
              keyboardType: 'default',
              placeholder: t('firstName'),
              maxLength: 30,
              autoComplete: 'name',
              autoCorrect: false,
              autoCapitalize: 'words',
            }}
            errorMessage={error.firstName}
            value={contact.first_name}
            onChangeText={(text) => {
              setContact({ ...contact, first_name: text });
            }}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <MegaInput
            nativeProps={{
              keyboardType: 'default',
              placeholder: t('lastName'),
              maxLength: 50,
              autoComplete: 'family-name',
              autoCorrect: false,
              autoCapitalize: 'words',
            }}
            errorMessage={error.lastName}
            value={contact.last_name}
            onChangeText={(text) => {
              setContact({ ...contact, last_name: text });
            }}
          />
        </View>

        {selectedCountry && (
          <View style={{ marginBottom: 16 }}>
            <InputCountrySelector
              defaultValue={contact.contact_number}
              countryList={countryList}
              selectedCountry={selectedCountry}
              onSelectCountry={(c: GenericList) => {
                setSelectedCountry(c);
              }}
              onChangeText={(phone: string) => {
                setContact({ ...contact, contact_number: phone });
              }}
              errorMessage={error.phone}
              isEdit={!isNewContact}
            />
          </View>
        )}

        {selectedCountry && toLower(selectedCountry.value) === 'cu' && (
          <View style={{ marginBottom: 16 }}>
            <InputNauta
              onChangeText={(email: string) => {
                console.log(email);
                setContact({ ...contact, email });
              }}
              defaultValue={contact.email}
              placeholder={t('emailNauta')}
            />
          </View>
        )}

        {selectedCountry && toLower(selectedCountry.value) === 'cu' && (
          <>
            <View style={{ paddingVertical: 20 }}>
              <MegaText
                size={18}
                font={FontType.medium}
                styles={{
                  lineHeight: 21,
                  color: Colors.primary,
                }}
              >
                {t('address')}
              </MegaText>
            </View>

            <View style={{ marginBottom: 16 }}>
              <MegaInput
                nativeProps={{
                  keyboardType: 'default',
                  placeholder: t('address'),
                  autoComplete: 'street-address',
                  autoCorrect: false,
                }}
                value={contact.address!}
                onChangeText={(text: string) => {
                  setContact({ ...contact, address: text || '' });
                }}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <GenericSelectorInput
                itemList={provinceList}
                selectedItem={selectedProvince || undefined}
                onSelectItem={(item) => {
                  if (item.value !== selectedProvince?.value) {
                    setSelectedMunicipality(null);
                    setMunicipalityList([]);
                    setSelectedProvince(item);
                  }
                }}
                placeholder={t('province')}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <GenericSelectorInput
                itemList={municipalityList}
                selectedItem={selectedMunicipality || undefined}
                onSelectItem={(item) => {
                  if (item.value !== selectedMunicipality?.value) {
                    setSelectedMunicipality(item);
                  }
                }}
                placeholder={t('municipality')}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <MegaInput
                nativeProps={{
                  keyboardType: 'default',
                  placeholder: t('city_town'),
                  autoComplete: 'off',
                  autoCorrect: false,
                }}
                value={contact.town!}
                onChangeText={(text: string) => {
                  setContact({ ...contact, town: text || '' });
                }}
              />
            </View>

            {acceptRemittance && (
              <>
                <View style={{ paddingVertical: 20 }}>
                  <MegaText
                    size={18}
                    font={FontType.medium}
                    styles={{
                      lineHeight: 21,
                      color: Colors.primary,
                    }}
                  >
                    {t('contactSection.infoRemittance')}
                  </MegaText>
                </View>

                <View style={{ marginBottom: 16 }}>
                  <MegaInput
                    nativeProps={{
                      keyboardType: 'number-pad',
                      placeholder: t('contactSection.carnet'),
                      maxLength: 11,
                      multiline: false,
                      autoCorrect: false,
                      autoComplete: 'off',
                    }}
                    errorMessage={error.carnet}
                    value={contact.carnet!}
                    onChangeText={(text: string) => {
                      setContact({ ...contact, carnet: text || '' });
                    }}
                  />
                </View>

                <View style={{ marginBottom: 16 }}>
                  <MegaInput
                    nativeProps={{
                      keyboardType: 'number-pad',
                      placeholder: t('contactSection.mlcCard'),
                      maxLength: 16,
                      multiline: false,
                      autoCorrect: false,
                      autoComplete: 'cc-number',
                    }}
                    errorMessage={error.mlc}
                    value={contact.mlc_card!}
                    onChangeText={(text: string) => {
                      setContact({ ...contact, mlc_card: text || '' });
                    }}
                  />
                </View>
              </>
            )}
          </>
        )}

        <View style={{ paddingVertical: 10 }}>
          <MegaButton
            variant="secondary"
            text={
              isNewContact
                ? t('contactSection.saveContact')
                : t('contactSection.updateContact')
            }
            onPress={onSave}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
