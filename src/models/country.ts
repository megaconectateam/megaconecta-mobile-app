export type Country = {
  calling_code: string;
  countcod: string;
  iso3: string;
  long_name: string;
  mobile_mask: string;
  short_name: string;
};

export type AuthorizedCountry = {
  count_cod: string;
  count_name: string;
  count_prefix: string;
  phone_mask: string;
  count_access_num: string;
};

export type TopUpCountry = {
  calling_code: string;
  count_cod: string;
  mobile_mask: string;
  short_name: string;
};
