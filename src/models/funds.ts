export type MegaFund = {
  amount: string;
  bonus?: string;
  label?: string;
};

export type MegaFundSelector = {
  id: string | number;
  amount: string;
  priceTitle: string;
  priceSubtitle: string;
  description: string;
};
