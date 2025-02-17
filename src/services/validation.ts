import api from './axios/api';

const checkBlacklistedPhone = async (phone: string): Promise<boolean> => {
  try {
    const response = await api.get<any>('/api/v1/payment/checkphoneblacklist', {
      params: {
        phone,
      },
    });

    if (!response.has_error && response.data) {
      return response.data.blacklisted;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

export const ValidationServices = {
  checkBlacklistedPhone,
};
