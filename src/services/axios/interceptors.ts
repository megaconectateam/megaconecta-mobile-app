import {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { LocalStorageService } from '../../utils';

const onRequest = async (
  config: InternalAxiosRequestConfig<any>,
): Promise<InternalAxiosRequestConfig> => {
  const token = await LocalStorageService.getToken();
  if (!config) {
    config = {
      headers: {} as AxiosRequestHeaders,
    };
  }
  if (!config.headers) {
    config.headers = {} as AxiosRequestHeaders;
  }

  // config.headers['X-App-Id'] = `${process.env.EXPO_PUBLIC_APP_ID}`;
  config.headers['X-App-Id'] = `97950ac6-857d-40b4-9e97-ce6fcd61d5f7`;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  if (response && response.data) {
    return response.data;
  }

  return response;
};

const onResponseError = async (
  error: AxiosError,
): Promise<AxiosError | undefined> => {
  console.log('error', error);
  if (error && error.response?.data) {
    return Promise.reject(error.response?.data);
  }

  return Promise.reject(error);
};

export const setupInterceptorsTo = (
  axiosInstance: AxiosInstance,
): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};
