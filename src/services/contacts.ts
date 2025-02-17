import * as Contacts from 'expo-contacts';
import { ContactPhone, MegaContact, SectionListData } from '../models';
import { convertContactToSectionList } from '../utils';
import api from './axios/api';

const getContacts = async (): Promise<MegaContact[]> => {
  const response = await api.get<any>('/api/v1/contacts');

  if (!response.has_error && response.array) {
    return response.array;
  }

  throw new Error(response.error);
};

const createContact = async (
  firstName: string,
  lastName: string,
  countryCode: string,
  phone: string,
  email?: string,
  address?: string,
  provinceId?: string,
  municipalityId?: string,
  town?: string,
  carneId?: string,
  mlcCard?: string,
) => {
  try {
    const response = await api.post('/api/v1/contacts', {
      first_name: firstName,
      last_name: lastName,
      countryCode,
      phone,
      email,

      address,
      province_id: provinceId,
      municipality_id: municipalityId,
      town,
      carne_id: carneId,
      mlc_card: mlcCard,
    });

    return { success: !response.has_error, isDuplicated: false };
  } catch (error: any) {
    return {
      success: false,
      isDuplicated: !!error.data?.isDuplicated || false,
    };
  }
};

const deleteContact = async (id: string) => {
  try {
    const response = await api.delete('/api/v1/contacts', { params: { id } });

    return { success: !response.has_error };
  } catch (error: any) {
    return {
      success: false,
    };
  }
};

const editContact = async (
  contactId: number,
  firstName: string,
  lastName: string,
  email?: string,
  address?: string,
  provinceId?: string,
  municipalityId?: string,
  town?: string,
  carneId?: string,
  mlcCard?: string,
) => {
  try {
    const response = await api.put('/api/v1/contacts', {
      first_name: firstName,
      last_name: lastName,
      contact_id: contactId,

      email,
      address,
      province_id: provinceId,
      municipality_id: municipalityId,
      town,
      carne_id: carneId,
      mlc_card: mlcCard,
    });

    return {
      success: !response.has_error,
      isDuplicated: false,
      notFound: false,
    };
  } catch (error: any) {
    return {
      success: false,
      isDuplicated: !!error.data?.isDuplicated || false,
      notFound: !!error.data?.notFound || false,
    };
  }
};

const getPhoneContacts = async (
  onlyNauta?: boolean,
  country?: string[],
): Promise<{
  success: boolean;
  permissions: boolean;
  data: SectionListData<ContactPhone>[];
}> => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const newSections = convertContactToSectionList(
          data,
          onlyNauta,
          country || [],
        );

        return {
          success: true,
          permissions: true,
          data: newSections,
        };
      }
    }

    return {
      success: false,
      permissions: false,
      data: [],
    };
  } catch (error) {
    return {
      success: false,
      permissions: false,
      data: [],
    };
  }
};

export const ContactService = {
  getContacts,
  createContact,
  deleteContact,
  editContact,
  getPhoneContacts,
};
