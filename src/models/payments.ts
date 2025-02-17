import { ReportPaymentMethodsEnum } from './enums';

export type NewCardInformation = {
  address1: string;
  cardCvc: string;
  cardExpiration: string;
  cardNumber: string;
  city: string;
  country: string;
  first_name: string;
  last_name: string;
  saveMethod: boolean;
  state: string;
  title: string;
  zip: string;
  address2?: string;

  id?: string; // only for UI stuff
};

export type NewPaypalInformation = {
  details: {
    email: string;
    firstName: string;
    lastName: string;
    countryCode?: string;
  };
  nonce: string;
  saveMethod: boolean;

  id?: string; // only for UI stuff
};

export type PaymentMethodCard = {
  id: string;
  address1: string;
  city: string;
  country: string;
  email: string;
  exp_date: string;
  first_name: string;
  last_four_digits: string;
  last_name: string;
  payment_type: ReportPaymentMethodsEnum;
  phone: string;
  title: string;
  token: string;
  state: string;
  zip: string;
  address2?: string;
  // first_four_digits: string;
};
