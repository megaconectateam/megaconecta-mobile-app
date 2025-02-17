import { MegaFund } from '../models';
import api from './axios/api';

const getFundProducts = async (): Promise<MegaFund[]> => {
  try {
    const response = await api.get<MegaFund>('/api/v1/funds/listfundproducts');

    if (!!response.array && response.array.length > 0) {
      return response.array.map((item) => ({
        amount: item.amount,
        bonus: item.bonus,
        label: `${parseFloat(item.amount).toFixed(2)}${
          item.bonus ? ' ' + item.bonus : ''
        }`,
      }));
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

export const FundServices = {
  getFundProducts,
};
