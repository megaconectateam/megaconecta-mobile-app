import { PaymentMethodCard } from '../models';
import api from './axios/api';

const getPaymentMethods = async () => {
  try {
    const response = await api.get<PaymentMethodCard>(
      '/api/v1/payment/paymentmethods',
    );

    if (response.array) {
      return response.array;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

export const PaymentServices = {
  getPaymentMethods,
};
