import { GenericResponse, LoginResponse, MegaUser } from '../models';
import api from './axios/api';

const login = async (
  username: string,
  password: string,
  token: string,
): Promise<LoginResponse> => {
  const errorMessageLockedAccount = 'loginSection.accountLocked';
  const errorMessage = 'loginSection.wrongPassword';

  try {
    const loginResponse = await api.post<{
      token: string;
      is_max_already?: boolean;
    }>('/api/v1/m/auth/login', {
      username,
      password,
      token,
    });

    if (!loginResponse.has_error && !!loginResponse.data?.token) {
      return {
        success: true,
        token: loginResponse.data.token,
      };
    }

    return {
      success: false,
      error: loginResponse.data?.is_max_already
        ? errorMessageLockedAccount
        : errorMessage,
      isAccountDisabled: loginResponse.data?.is_max_already,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.data?.is_max_already
        ? errorMessageLockedAccount
        : errorMessage,
      isAccountDisabled: error?.data?.is_max_already,
    };
  }
};

const getUser = async (): Promise<MegaUser | null> => {
  const response = await api.get<MegaUser>('/api/v1/auth/whoami');

  if (!response.has_error && response.data) {
    return response.data;
  }

  return null;
};

const requestOtpLogin = async (
  username: string,
  countryCode: string,
): Promise<GenericResponse> => {
  const errorMessage = 'Su Teléfono no es válido.';
  try {
    const loginResponse = await api.post('/api/v1/m/auth/login-sms', {
      username,
      countryCode,
    });

    if (!loginResponse.has_error) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: errorMessage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: errorMessage,
    };
  }
};

const validateOtpLogin = async (
  username: string,
  code: string,
): Promise<LoginResponse> => {
  const errorMessage = 'El código no es válido.';
  const errorMessageLockedAccount =
    'Su cuenta ha sido bloqueada por motivos de seguridad. Por favor, contacte nuestro departamento de Servicio al Cliente para restablecer su cuenta.';

  try {
    const loginResponse = await api.post<{
      token: string;
      is_account_disabled?: boolean;
    }>('/api/v1/m/auth/verify-login-sms', {
      username,
      code,
    });

    if (!loginResponse.has_error && !!loginResponse.data?.token) {
      return {
        success: true,
        token: loginResponse.data.token,
      };
    }

    return {
      success: false,
      error: loginResponse.data?.is_account_disabled
        ? errorMessageLockedAccount
        : errorMessage,
      isAccountDisabled: loginResponse.data?.is_account_disabled,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.data?.is_account_disabled
        ? errorMessageLockedAccount
        : errorMessage,
      isAccountDisabled: error?.data?.is_account_disabled,
    };
  }
};

const logOut = async () => {
  try {
    await api.get('/api/v1/m/auth/destroy');
    return true;
  } catch (e) {
    return false;
  }
};

export const AuthService = {
  login,
  getUser,
  requestOtpLogin,
  validateOtpLogin,
  logOut,
};
