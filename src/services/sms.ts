import { SmsConversation } from '../models';
import api from './axios/api';

const getConversations = async (): Promise<SmsConversation[]> => {
  try {
    const response = await api.get<SmsConversation>(
      '/api/v1/sms/conversations',
    );

    if (response.array) {
      return response.array;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

export const SmsService = {
  getConversations,
};
