export interface MegaAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface MegaUserProfile {
  accept_remittance: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: MegaAddress;
  receive_sms: boolean;
  receive_emails: boolean;
  new_account_promo: {
    is_active: boolean;
    amount: number;
  };
  accessNumber: string;
}

export interface MegaUserExtra {
  sms_free_out: number;
  sms_free_in: number;
  balance: number;
  balance_format?: string;
  free_min_cuba: number;
  cust_free_sms: number;
  dailySms: number;
}

export interface MegaProfile {
  user: MegaUserProfile;
  account: MegaUserExtra;
}

export type updateProfileParams = {
  firstName?: string;
  lastName?: string;
  email?: string;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  receiveEmail: boolean;
  receiveSms: boolean;
};
