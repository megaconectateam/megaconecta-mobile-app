import parsePhoneNumber from 'libphonenumber-js';
import { compact, get, toUpper } from 'lodash';
import { UseQueryResult } from 'react-query';
import { AutoRechargeFund } from '../models';

export const getMaskByCountry = (
  mask: string,
  ignoreCountryCode?: boolean,
): any[] => {
  let array = mask.split('').map((char: string) => {
    if (char === 'N') {
      return /\d/;
    }

    if (ignoreCountryCode) {
      return null;
    }

    return char;
  });

  if (!ignoreCountryCode && array.length && array[0] !== '+') {
    array.unshift('+');
  }

  array = compact(array);
  return array || [];
};

export const isSuccessQueries = (queries: UseQueryResult[]): boolean => {
  let isSuccess = true;

  queries.forEach((query) => {
    isSuccess = isSuccess && query.isSuccess;
  });

  return isSuccess;
};

export const isLoadingQueries = (queries: UseQueryResult[]): boolean => {
  let isLoading = false;

  queries.forEach((query) => {
    isLoading =
      isLoading || query.isLoading || (query.isError && query.isFetching);
  });

  return isLoading;
};

export const isErrorQueries = (queries: UseQueryResult[]): boolean => {
  let isLoading = false;

  queries.forEach((query) => {
    isLoading = isLoading || query.isError;
  });

  return isLoading;
};

export const currencyFormat = (num: number, hideSign?: boolean) => {
  return (
    (hideSign ? '' : '$') +
    num.toFixed(2).replace(/(\d)(?=(\0212d{3})+(?!\d))/g, '$1,')
  );
};

export const hasAutoRechargeInfo = (info: AutoRechargeFund | null) => {
  if (info && info.amount > 0 && info.trigger && !!info.payment_method_id) {
    return true;
  }

  return false;
};

export const getFormattedPhoneNumber = (
  phone: string,
  countryCode: string,
  asInternational: boolean = true,
) => {
  const phoneNumber = parsePhoneNumber(phone, countryCode as any);

  if (phoneNumber) {
    return asInternational
      ? phoneNumber.formatInternational()
      : phoneNumber.formatNational();
  }

  return null;
};

export const formatCardNumber = (value: string) => {
  const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
  const onlyNumbers = value.replace(/[^\d]/g, '');

  return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
    [$1, $2, $3, $4].filter((group) => !!group).join(' '),
  );
};

export const getInitials = (firstName: string, lastName?: string) => {
  const initial1 = get(firstName.split(''), '[0]');
  const pos = lastName ? '[0]' : '[1]';
  const initial2 = get((lastName || firstName).split(''), pos, '');

  return toUpper(`${initial1}${initial2}`);
};

export const ellipsisNauta = (nauta: string, width: number): string => {
  let maxChar = 28;
  if (width < 400) {
    maxChar = 23;
  }

  if (width < 376) {
    maxChar = 20;
  }

  let ellipsis = '';
  if (nauta.length > maxChar) {
    ellipsis = '...';
  }

  return `${nauta.substring(0, maxChar)}${ellipsis}`;
};
