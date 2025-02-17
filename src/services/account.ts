import { MegaProfile, updateProfileParams } from '../models/profile';
import { AutoRechargeFund, UserBalance } from '../models/user';
import api from './axios/api';

const getProfileData = async (): Promise<MegaProfile> => {
  try {
    const response = await api.get<MegaProfile>('/api/v1/account/getprofile');

    if (response.data) {
      if (
        !!response.data.account.balance &&
        response.data.account.balance > 0
      ) {
        response.data.account.balance_format = (
          Math.round(response.data.account.balance * 100) / 100
        ).toFixed(2);
      }

      return response.data;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (params: updateProfileParams) => {
  const url = '/api/v1/account/profile';
  const payload = {
    first_name: params.firstName,
    last_name: params.lastName,
    email: params.email,
    change_password: false,
    address1: params.address1,
    city: params.city,
    state: params.state,
    country: params.country,
    zip: params.zipCode,
    receive_email: params.receiveEmail,
    receive_sms: params.receiveSms,
  };

  try {
    const response = await api.put<boolean>(url, payload);

    if (!response.has_error) {
      return true;
    }

    throw new Error(response.error ?? 'ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const getBalance = async (): Promise<UserBalance> => {
  try {
    const response = await api.get<UserBalance>('/api/v1/account/getbalance');

    if (response.data) {
      const userBalance = response.data;

      return userBalance;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const getAutoRechargeData = async () => {
  try {
    const response = await api.get<AutoRechargeFund>(
      '/api/v1/account/getaautorechargeinfo',
    );

    if (response.data) {
      return response.data;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

const updateAutoRecharge = async (
  paymentMethodId: string,
  minBalance: number,
  amount: number,
): Promise<boolean> => {
  try {
    const response = await api.put('/api/v1/account/auto-recharge', {
      payment_method_id: paymentMethodId,
      min_balance: minBalance,
      amount_add: amount,
    });

    return !response.has_error;
  } catch (error) {
    return false;
  }
};

const updatePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    const response = await api.put<boolean>('/api/v1/account/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });

    if (!response.has_error) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

const updateCommunications = async (
  receiveSms: boolean,
  receiveEmails: boolean,
): Promise<boolean> => {
  try {
    const response = await api.put<boolean>('/api/v1/account/communication', {
      receive_sms: receiveSms,
      receive_email: receiveEmails,
    });

    if (!response.has_error) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

export const AccountServices = {
  getProfileData,
  getBalance,
  getAutoRechargeData,
  updateAutoRecharge,
  updateProfile,
  updatePassword,
  updateCommunications,
};
