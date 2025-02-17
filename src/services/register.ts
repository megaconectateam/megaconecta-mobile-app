import { toUpper } from 'lodash';
import api from './axios/api';

const preRegister = async (
  email: string,
  phone: string,
  countryCode: string,
): Promise<{ success: boolean; code: string }> => {
  try {
    const response = await api.post<{ code?: string }>('/api/v1/register/pre', {
      email,
      phone,
      country_code: countryCode,
    });

    return {
      success: !response.has_error,
      code: response.data?.code || '',
    };
  } catch (error: any) {
    return {
      success: false,
      code: error.data?.code || '',
    };
  }
};

const requestPinValidation = async (
  type: 'sms' | 'call',
  phone: string,
  countryCode: string,
) => {
  try {
    const response = await api.get<{ code?: string }>(
      '/api/v1/register/pin/request',
      {
        params: {
          type: type === 'sms' ? 1 : 2,
          phone,
          country_code: toUpper(countryCode),
        },
      },
    );

    return {
      success: !response.has_error,
      code: response.data?.code || '',
    };
  } catch (error: any) {
    return {
      success: false,
      code: error.data?.code || '',
    };
  }
};

const validatePin = async (phone: string, pin: string) => {
  try {
    const response = await api.get<{ code?: string; max_attempt?: boolean }>(
      '/api/v1/register/pin/validate',
      {
        params: {
          phone,
          pin: Number(pin),
        },
      },
    );

    return {
      success: !response.has_error,
      code: response.data?.code || '',
      maxAttempt: response.data?.max_attempt || false,
    };
  } catch (error: any) {
    return {
      success: false,
      code: error.data?.code || '',
      maxAttempt: error.data?.max_attempt || false,
    };
  }
};

const createAccount = async (
  email: string,
  phone: string,
  country: string,
  firstName: string,
  lastName: string,
  password: string,
  promoSms: boolean,
  cofReference?: string,
  source?: string,
): Promise<{
  success: boolean;
  code: string;
  token?: string;
}> => {
  try {
    const response = await api.post<{
      code?: string;
      token?: string;
    }>('/api/v1/register/account', {
      email,
      phone,
      country,
      first_name: firstName,
      last_name: lastName,
      password,
      promo_sms: promoSms ? 'true' : 'false',
      cof_reference: cofReference,
      source,
    });

    return {
      success: !response.has_error,
      code: response.data?.code || '',
      token: response.data?.token || '',
    };
  } catch (error: any) {
    return {
      success: false,
      code: error.data?.code || '',
    };
  }
};

const requestForgotPassword = async (phone: string, type: 'sms' | 'call') => {
  try {
    const response = await api.post<{ code?: string }>(
      '/api/v1/register/forgot-password/request',
      {
        phone,
        type: type === 'sms' ? 1 : 2,
      },
    );

    return {
      success: !response.has_error,
      code: response.data?.code || '',
    };
  } catch (error: any) {
    return {
      success: false,
      code: error.data?.code || '',
    };
  }
};

const changePassword = async (phone: string, password: string) => {
  try {
    const response = await api.post<{ code?: string }>(
      '/api/v1/register/forgot-password/apply',
      {
        phone,
        password,
      },
    );

    return {
      success: !response.has_error,
      code: response.data?.code || '',
    };
  } catch (error: any) {
    return {
      success: false,
      code: error.data?.code || '',
    };
  }
};

export const RegisterService = {
  preRegister,
  requestPinValidation,
  validatePin,
  createAccount,
  requestForgotPassword,
  changePassword,
};
