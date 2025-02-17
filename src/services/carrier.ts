import { MegaCarrier, MegaCarrierRateResponse, TopUpCountry } from '../models';
import api from './axios/api';

const getCarrierByPhoneAndCategory = async (
  phone: string,
): Promise<string | undefined> => {
  try {
    const response = await api.get<string>(
      '/api/v1/carrier/listbyphonecategory',
      {
        params: {
          phone,
        },
      },
    );

    if (!response.has_error) {
      return response.data;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const getCountries = async (): Promise<TopUpCountry[]> => {
  try {
    const response = await api.get<TopUpCountry>(
      '/api/v1/countries/listactivecarriercountries',
    );

    if (!!response.array && response.array.length > 0) {
      return response.array;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const getCarriers = async (
  country: string,
  category: 'NAUTA' | 'TOPUP',
): Promise<MegaCarrier[]> => {
  try {
    const response = await api.get<MegaCarrier>(
      '/api/v1/carrier/listbycountry',
      {
        params: {
          country,
          category,
        },
      },
    );

    if (!!response.array && response.array.length > 0) {
      return response.array;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const getCarrierRates = async (
  operator: string,
  // offer_cod?: number | undefined,
): Promise<MegaCarrierRateResponse> => {
  try {
    const response = await api.get<MegaCarrierRateResponse>(
      '/api/v1/rates/listtopuprates',
      {
        params: {
          operator,
        },
      },
    );

    if (response.data) {
      return response.data;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

export const CarrierServices = {
  getCarrierByPhoneAndCategory,
  getCarrierRates,
  getCarriers,
  getCountries,
};
