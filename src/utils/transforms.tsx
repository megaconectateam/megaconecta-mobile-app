import * as Contacts from 'expo-contacts';
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js';
import { compact, get, orderBy, toLower, toUpper, trim } from 'lodash';
import moment from 'moment';
import { SVGs } from '../assets/svg';
import {
  AuthorizedCountry,
  ContactPhone,
  Country,
  GenericList,
  Location,
  MegaCarrier,
  MegaCarrierRate,
  MegaCarrierRateFuture,
  MegaCarrierRateType,
  MegaContact,
  MegaFundReportItem,
  MegaReferralReportItem,
  MegaRemittanceReportItem,
  MegaReportBase,
  MegaStoreReportItem,
  MegaTopUpReportItem,
  SectionListData,
  TopUpCountry,
} from '../models';
import { ReportTypesEnum } from '../models/enums';
import { getFormattedPhoneNumber, getInitials } from './functions';

export const convertAuthCountryToGenericList = (
  country: AuthorizedCountry,
): GenericList => {
  return {
    label: country.count_name,
    value: (country.count_cod || '').toLowerCase(),
    extraLabel: (`${country.count_prefix}` || '').startsWith('+')
      ? country.count_prefix
      : `+${country.count_prefix}`,
    phoneMask: country.phone_mask,
  };
};

export const convertTopupCountryToGenericList = (
  country: TopUpCountry,
): GenericList => {
  return {
    label: country.short_name,
    value: (country.count_cod || '').toLowerCase(),
    extraLabel: (`${country.calling_code}` || '').startsWith('+')
      ? country.calling_code
      : `+${country.calling_code}`,
    phoneMask: country.mobile_mask,
  };
};

export const convertContactCountryToGenericList = (
  country: Country,
): GenericList => {
  return {
    label: country.short_name,
    value: (country.countcod || '').toLowerCase(),
    extraLabel: (`${country.calling_code}` || '').startsWith('+')
      ? country.calling_code
      : `+${country.calling_code}`,
    phoneMask: country.mobile_mask,
  };
};

export const convertLocationToGenericList = (
  country: Location,
): GenericList => {
  return {
    label: country.name,
    value: country.id.toString(),
  };
};

export const convertContactToSectionList = (
  contact: Contacts.Contact[],
  onlyNauta?: boolean,
  country: string[] = [],
): SectionListData<ContactPhone>[] => {
  const contactP: (ContactPhone | undefined)[] = contact.map(
    (c: Contacts.Contact) => {
      const email = (c.emails || []).find((e) =>
        /@nauta.com.cu$/.test(trim(e.email)),
      );

      if (onlyNauta && !email) {
        return undefined;
      }

      if ((c.phoneNumbers || []).length === 0 || !c.name) {
        return undefined;
      }

      let newPhone = '',
        formattedPhone = '',
        countryCode = '';

      let cPhone = (c.phoneNumbers || []).find((p) => p.label === 'mobile');
      if (!cPhone) {
        cPhone = get(c, 'phoneNumbers.0', undefined);
      }

      if (!cPhone || !cPhone.number) {
        return undefined;
      }

      const formatted = parsePhoneNumber(
        cPhone.number,
        (toUpper(cPhone.countryCode) as CountryCode) || 'US',
      );

      if (formatted?.isValid()) {
        newPhone = cPhone.number;
        formattedPhone = formatted.formatInternational();
        countryCode = formatted.country || cPhone.countryCode || '';
      } else {
        newPhone = cPhone.number;
        formattedPhone = cPhone.number;
        countryCode = cPhone.countryCode || 'US';
      }

      if (country.length > 0 && !country.includes(toLower(countryCode))) {
        return undefined;
      }

      return {
        id: c.id,
        firstName: trim(c.firstName) || '',
        lastName: trim(c.lastName),
        fullName: trim(c.name),
        initials: getInitials(trim(c.firstName || c.name), trim(c.lastName)),
        emailNauta: email?.email || '',
        phoneNumber: newPhone,
        formattedPhone,
        countryCode,
        phoneType: cPhone.label === 'mobile' ? 'mobile' : 'other',
      } as ContactPhone;
    },
  );

  const newContactP = orderBy(compact(contactP), ['name'], ['asc']);

  const sections: SectionListData<ContactPhone>[] = [];
  newContactP.forEach((c) => {
    const initial = toUpper(get((c.firstName || c.fullName).split(''), '[0]'));
    const section = sections.find((s) => s.title === initial);
    if (section) {
      section.data.push(c);
    } else {
      sections.push({ title: initial, data: [c] });
    }
  });

  return orderBy(sections, ['title'], ['asc']);
};

export const convertMegaContactToPhoneContact = (
  contact: MegaContact,
): ContactPhone => {
  return {
    firstName: contact.first_name || contact.contact_name,
    lastName: contact.last_name || '',
    fullName: contact.contact_name,
    id: `${contact.id}`,
    initials: getInitials(
      contact.first_name || contact.contact_name,
      contact.last_name,
    ),
    phoneNumber: contact.contact_number,
    phoneType: 'mobile',
    emailNauta: contact.email,
    countryCode: contact.country_code,
    isMegaconecta: true,
    formattedPhone: getFormattedPhoneNumber(
      contact.contact_number,
      contact.country_code,
    ),
  } as ContactPhone;
};

export const convertTopupCarrierToGenericList = (
  carrier: MegaCarrier,
): GenericList => {
  return {
    label: carrier.name,
    value: `${carrier.uid}`,
    extraLabel: carrier.currency_code,
    icon: <SVGs.CarrierIcon />,
  } as GenericList;
};

//TODO: remove this
export const convertRatesOldFormat = (
  rate: any,
  type: MegaCarrierRateType,
  future?: MegaCarrierRateFuture,
): MegaCarrierRate => {
  return {
    id: `${type}-${rate.id}`,
    localAmount: rate.localamount,
    realAmount: rate.realamount,
    remoteAmount: rate.remoteamount,
    remoteCurrency: rate.remotecurrency,
    remoteFormattedAmount: rate.remoteformatedamount,
    remoteMultiple: rate.remotemultiple,
    type,
    future,
  } as MegaCarrierRate;
};

export const onlyNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const handleReportDates = (
  reportItem: MegaReportBase,
): MegaReportBase => {
  const newObject = { ...reportItem };

  if ('created' in newObject) {
    newObject.date = moment(
      (newObject as MegaTopUpReportItem).created,
      'DD/MM/YYYY HH:mm a',
    ).toDate();
    newObject.reportType = ReportTypesEnum.topup;
  }

  if ('datelog' in newObject) {
    newObject.date = moment(
      (newObject as MegaFundReportItem).datelog,
      'DD/MM/YYYY HH:mm a',
    ).toDate();
    newObject.reportType = ReportTypesEnum.payment;
  }

  if ('created_date' in newObject && 'paid' in newObject) {
    newObject.date = moment(
      (newObject as MegaRemittanceReportItem).created_date,
      'DD/MM/YYYY HH:mm a',
    ).toDate();
    newObject.reportType = ReportTypesEnum.remittance;
  }

  if ('created_date' in newObject && 'order_total' in newObject) {
    newObject.date = moment(
      (newObject as MegaStoreReportItem).created_date,
      'DD/MM/YYYY HH:mm a',
    ).toDate();
    newObject.reportType = ReportTypesEnum.market;
  }

  if ('zelle_phone' in newObject) {
    newObject.date = moment(
      (newObject as MegaReferralReportItem).created,
      'DD/MM/YYYY HH:mm a',
    ).toDate();
    newObject.reportType = ReportTypesEnum.referral;
  }

  return newObject;
};
