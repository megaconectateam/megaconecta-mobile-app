import { isEmpty } from 'lodash';
import {
  MegaFundReportItem,
  MegaReferralReportItem,
  MegaRemittanceReportItem,
  MegaReportBase,
  MegaStoreOrder,
  MegaStoreReportItem,
  MegaTopUpReportItem,
} from '../models';
import { ReportTypesEnum } from '../models/enums';
import { handleReportDates } from '../utils';
import api from './axios/api';

const getReport = async (
  type: ReportTypesEnum,
  skip: number,
  take: number,
): Promise<MegaReportBase[]> => {
  let data = [];

  switch (type) {
    case ReportTypesEnum.remittance:
      data = await getRemittanceReport(skip, take);
      break;

    case ReportTypesEnum.payment:
      data = await getFundsReport(skip, take);
      break;

    case ReportTypesEnum.topup:
      data = await getTopupReport(skip, take);
      break;

    case ReportTypesEnum.market:
      data = await getStoreReport(skip, take);
      break;

    case ReportTypesEnum.referral:
      data = await getReferralReport(skip, take);
      break;
  }

  return data.map(handleReportDates);
};

const getReferralReport = async (
  skip: number,
  take: number,
): Promise<MegaReferralReportItem[]> => {
  try {
    const response = await api.get<MegaReferralReportItem>(
      '/api/v1/account/getreferralreport',
      {
        params: {
          skip,
          take,
          sort_field: 'CREATED',
          sort_dir: 'DESC',
        },
      },
    );

    if (!response.has_error && response.array) {
      return response.array;
    }

    return [];
  } catch (error) {
    throw error;
  }
};

const getRemittanceReport = async (
  skip: number,
  take: number,
): Promise<MegaRemittanceReportItem[]> => {
  try {
    const params = {
      skip,
      take,
      sort_field: 'created',
      sort_dir: 'DESC',
    };
    const options = {
      params,
    };

    const response = await api.get<MegaRemittanceReportItem>(
      '/api/v1/remittance/getremittancereport',
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

const getFundsReport = async (
  skip: number,
  take: number,
): Promise<MegaFundReportItem[]> => {
  try {
    const params = {
      skip,
      take,
      sort_field: 'DATELOG',
      sort_dir: 'DESC',
    };
    const options = {
      params,
    };

    const response = await api.get<MegaFundReportItem>(
      '/api/v1/funds/getfundreport',
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

const getTopupReport = async (
  skip: number,
  take: number,
): Promise<MegaTopUpReportItem[]> => {
  try {
    const params = {
      skip,
      take,
      sort_field: 'TRANSACTION_TIMESTAMP',
      sort_dir: 'DESC',
    };
    const options = {
      params,
    };

    const response = await api.get<MegaTopUpReportItem>(
      '/api/v1/topups/gettopupreport',
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

const getStoreReport = async (
  skip: number,
  take: number,
): Promise<MegaStoreReportItem[]> => {
  try {
    const params = {
      skip,
      take,
      sort_field: 'createdDate',
      sort_dir: 'DESC',
    };
    const options = {
      params,
    };

    const response = await api.get<MegaStoreReportItem>(
      '/api/v1/store/getstorereport',
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

const getRemittanceDetails = async (
  id: number,
): Promise<MegaRemittanceReportItem> => {
  const response = await api.get<MegaRemittanceReportItem>(
    '/api/v1/remittance/details',
    {
      params: {
        id,
      },
    },
  );

  if (!response.has_error && response.data) {
    return response.data;
  }

  throw new Error(response.error);
};

const getStoreOrderDetails = async (
  orderId: number,
): Promise<MegaStoreOrder> => {
  const response = await api.get<MegaStoreOrder>(
    '/api/v1/store/getstorereportdetails',
    {
      params: {
        order_id: orderId,
      },
    },
  );

  if (!response.has_error && response.data) {
    return response.data;
  }

  throw new Error(response.error);
};

export const ReportsServices = {
  getReport,
  getRemittanceReport,
  getFundsReport,
  getTopupReport,
  getStoreReport,
  getStoreOrderDetails,
  getRemittanceDetails,
};
