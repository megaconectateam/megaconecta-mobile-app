import { MegaContent } from '../models';
import api from './axios/api';

const getContent = async (
  tag: string,
  language: string,
): Promise<MegaContent> => {
  try {
    const response = await api.get<MegaContent>('/api/v1/contents/getcontent', {
      params: {
        tag,
        language,
      },
    });

    if (response.data && !response.has_error) {
      return response.data;
    }

    throw new Error('ERROR: No data');
  } catch (error) {
    throw error;
  }
};

export const ContentService = {
  getContent,
};
