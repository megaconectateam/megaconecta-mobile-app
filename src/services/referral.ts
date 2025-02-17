import { UserReferralBalance } from '../models';
import api from './axios/api';

const getReferralBalance = async (): Promise<number> => {
  try {
    const response = await api.get<UserReferralBalance>(
      '/api/v1/account/getreferralbalance',
    );

    if (response.data) {
      return Number(response.data.referral_balance);
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const sendReferral = async ({
  country,
  language = 'es',
  phone,
}: {
  country: string;
  language?: string | undefined;
  phone: string;
}): Promise<boolean> => {
  try {
    const response = await api.post<any>('/api/v1/account/sendreferral', {
      country,
      language,
      phone,
    });

    if (!response.has_error) {
      return true;
    }

    throw new Error(response.error ?? 'ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const withdrawByZelle = async (
  full_name: string,
  phone?: string,
  email?: string,
): Promise<boolean> => {
  try {
    const response = await api.post<any>('/api/v1/account/withdrawbyzelle', {
      full_name,
      phone,
      email,
    });

    if (!response.has_error) {
      return true;
    }

    throw new Error(response.error ?? 'ERROR: No data');
  } catch (error) {
    throw error;
  }
};

export const ReferralServices = {
  getReferralBalance,
  sendReferral,
  withdrawByZelle,
};
