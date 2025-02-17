import { ContactPhone } from './contacts';
import { GenericList } from './genericList';

export type MegaCarrierRateType = 'topup' | 'promo' | 'bundle' | 'nauta';
export type MegaCarrierRateFuture = {
  enabled: boolean;
  date?: string;
};

export type MegaCarrierRate = {
  id: string;
  localAmount: string;
  realAmount: string;
  remoteAmount: string;
  remoteFormattedAmount: string;
  remoteMultiple: string;
  remoteCurrency: string;
  type: MegaCarrierRateType;
  future?: MegaCarrierRateFuture;
};

export type MegaCarrier = {
  currency_code: string;
  name: string;
  uid: string;
};

export type TopUpInitialData = {
  discount: number;
  future_date: string | undefined;
  has_promotion: boolean;
  is_future: boolean;
  min_promotion: number;
  offer_cod: number;
};

export type MegaCarrierRateResponse = {
  initial_data: TopUpInitialData;
  topup_products: MegaCarrierRate[];
  offer_products: MegaCarrierRate[];
  bundle_products: MegaCarrierRate[];
};

export type TopupCartItem = {
  uuid: string;
  carrier: GenericList;
  carrierRate: MegaCarrierRate;
  contact: ContactPhone;
  country: GenericList;
  futurePromotionalDate?: string;
  type: MegaCarrierRateType;
  discount?: number;
};
