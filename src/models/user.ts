export interface MegaUser {
  CUSTOMERNAME?: string;
  CUSTOMER_LASTNAME?: string;
  COUNTRY?: string;
  USERNAME: string;
  EMAILADDRESS?: string;
}

export type UserBalance = {
  balance: number;
};

export type UserReferralBalance = {
  referral_balance: string;
};

export type AutoRechargeFund = {
  trigger: number;
  amount: number;
  payment_method_id: string;
};
