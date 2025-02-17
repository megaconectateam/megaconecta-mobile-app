import api from './axios/api';

const validateMlc = async (mlc_card: string): Promise<boolean> => {
  try {
    const response = await api.post<any>('/api/v1/remittance/check_mlc_card', {
      mlc_card,
    });

    if (!response.has_error) {
      return response.data.is_valid;
    }

    return false;
  } catch (error) {
    return false;
  }
};

export const RemittanceService = {
  validateMlc,
};
