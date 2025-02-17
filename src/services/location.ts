import { Location } from '../models';
import api from './axios/api';

const getProvinces = async (): Promise<Location[]> => {
  const url = '/api/v1/store/getprovinces';
  const response = await api.get<Location>(url);

  if (!response.has_error && response.array) {
    return response.array;
  }

  throw new Error(response.error);
};

const getMunicipalities = async (provinceId: string): Promise<Location[]> => {
  const url = '/api/v1/store/getmunicipalities';
  const response = await api.get<Location>(url, {
    params: {
      province: provinceId,
    },
  });

  if (!response.has_error && response.array) {
    return response.array;
  }

  throw new Error(response.error);
};

export const LocationServices = {
  getProvinces,
  getMunicipalities,
};
