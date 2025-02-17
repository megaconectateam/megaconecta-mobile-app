import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { MegaUser } from '../models';

export const KEYS = {
  token: '@token',
  user: '@user',
  language: '@language',
  onBoard: '@onBoard',
};

const getToken = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.token);
    if (data) {
      return data;
    }

    return null;
  } catch (_) {
    return null;
  }
};

const setToken = async (token: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(KEYS.token, token);
    return true;
  } catch (_) {
    return false;
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.token);
    return true;
  } catch (_) {
    return false;
  }
};

const getAuthenticatedUser = async (): Promise<null | MegaUser> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.user);
    if (data) {
      return JSON.parse(data);
    }

    return null;
  } catch (_) {
    return null;
  }
};

const setAuthenticatedUser = async (user: MegaUser): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
    return true;
  } catch (_) {
    return false;
  }
};

const removeAuthenticatedUser = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.user);
    return true;
  } catch (_) {
    return false;
  }
};

const setLanguage = async (language: 'es' | 'en'): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(KEYS.language, language);
    return true;
  } catch (_) {
    return false;
  }
};

const getLanguage = async (): Promise<'es' | 'en' | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.language);
    if (data) {
      return data as 'es' | 'en';
    }

    return null;
  } catch (_) {
    return null;
  }
};

const setOnBoardVisited = async (): Promise<boolean> => {
  try {
    const date = moment().format('YYYY-MM-DD');

    await AsyncStorage.setItem(KEYS.onBoard, date);
    return true;
  } catch (_) {
    return false;
  }
};

const getOnBoardVisited = async (): Promise<Date | null> => {
  try {
    const data: string | null = await AsyncStorage.getItem(KEYS.onBoard);
    if (data) {
      return moment(data, 'YYYY-MM-DD').toDate();
    }

    return null;
  } catch (_) {
    return null;
  }
};

const removeOnBoardVisited = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.onBoard);
    return true;
  } catch (_) {
    return false;
  }
};

export const LocalStorageService = {
  getToken,
  setToken,
  removeToken,

  getAuthenticatedUser,
  setAuthenticatedUser,
  removeAuthenticatedUser,

  setLanguage,
  getLanguage,

  setOnBoardVisited,
  getOnBoardVisited,
  removeOnBoardVisited,
};
