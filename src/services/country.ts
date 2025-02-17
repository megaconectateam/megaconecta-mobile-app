import api from './axios/api';
import { AuthorizedCountry, Country, TopUpCountry } from '../models/country';

const getAllAuthorizedCountries = async (): Promise<AuthorizedCountry[]> => {
  try {
    const response = await api.get<AuthorizedCountry>(
      '/api/v1/countries/listregistercountries',
    );

    if (response.array) {
      return response.array;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const getAllCountriesForContacts = async (): Promise<Country[]> => {
  try {
    const response = await api.get<Country>('/api/v1/countries/contact');

    if (response.array) {
      return response.array;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const getAllCountriesForBundle = async (): Promise<TopUpCountry[]> => {
  try {
    const response = await api.get<TopUpCountry>(
      '/api/v1/countries/listbundlecountries',
    );

    if (response.array) {
      return response.array;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

export const CountryServices = {
  getAllAuthorizedCountries,
  getAllCountriesForContacts,
  getAllCountriesForBundle,
};
