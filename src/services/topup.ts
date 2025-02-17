import { TopUpInitialData } from '../models';
import api from './axios/api';

const getInitialData = async (): Promise<TopUpInitialData> => {
  try {
    const response = await api.get<TopUpInitialData>(
      '/api/v1/topups/getinitialdata',
      {
        params: {},
      },
    );

    if (!response.has_error && !!response.data) {
      return response.data;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

export const TopUpServices = {
  getInitialData,
};
