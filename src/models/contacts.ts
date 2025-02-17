export type ContactPhone = {
  id: string;
  firstName: string;
  lastName?: string;
  fullName: string;
  initials: string;
  emailNauta?: string;
  countryCode?: string;
  phoneNumber: string;
  formattedPhone: string;
  phoneType: 'mobile' | 'other';
  isMegaconecta?: boolean;
};

export interface MegaContact {
  id: number;
  account_number?: string;
  contact_number: string;
  contact_name: string;
  country_code: string;
  email?: string;
  direct_dial?: string;
  call_rate?: number;
  sms_rate?: number;
  is_country_active?: boolean;
  first_name: string;
  last_name: string;
  address?: string;
  province_id?: number;
  municipality_id?: number;
  town?: string;
  carnet?: string;
  mlc_card?: string;
  province_name?: string;
  municipality_name?: string;
  sms_array?: any[];
  line_cuba?: string;
  line_usa?: string;
}
