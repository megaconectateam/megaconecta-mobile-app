import { isEmpty } from 'lodash';
import { CallRates, CallReport, SetCall } from '../models';
import api from './axios/api';

const getCallRate = async (phone: string): Promise<CallRates | null> => {
  try {
    const options = {
      params: {
        phone,
      },
    };

    const response = await api.get<CallRates>(
      `/api/v1/rates/getcallrate`,
      options,
    );

    if (!response.has_error && response.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const setCall = async (phone: string): Promise<null | SetCall> => {
  try {
    const options = {
      params: {
        phone,
      },
    };

    const response = await api.get<SetCall>(`/api/v1/calls/setcall`, options);

    if (!response.has_error && response.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCallReport = async (
  skip: number,
  take: number,
): Promise<CallReport[]> => {
  try {
    const sortField = 'call_connect_time';
    const sortDir = 'desc';

    const params = {
      skip,
      take,
      sort_field: sortField,
      sort_dir: sortDir,
    };
    const options = {
      params,
    };

    const response = await api.get<CallReport>(
      `/api/v1/calls/getcallreport`,
      options,
    );

    if (!response.has_error && !isEmpty(response.array)) {
      return response.array || [];
    }

    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const CallServices = {
  getCallRate,
  setCall,
  getCallReport,
};
