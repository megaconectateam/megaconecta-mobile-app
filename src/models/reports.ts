import {
  ReportPaymentMethodsEnum,
  ReportReferralCategoryEnum,
  ReportStatusEnum,
  ReportTypesEnum,
} from './enums';

export interface MegaReportBase {
  id: number | string;
  date: Date;
  reportType: ReportTypesEnum;
}

export interface MegaTopUpReportItem extends MegaReportBase {
  approval_code: string;
  carrier: number;
  created: string;
  destination: string;
  payment_type: ReportPaymentMethodsEnum;
  promotion?: string;
  received_product: string;
  response_text: string;
  status: ReportStatusEnum;
  table: string;
  total_price: string;
  transaction: number;
}

export interface MegaFundReportItem extends MegaReportBase {
  amount_added: string;
  amount_charged: string;
  approval_code: string;
  description: string;
  new_balance: string;
  payment_type: ReportPaymentMethodsEnum;
  promotion_code: string;
  status: ReportStatusEnum;
  transaction_id: number;
  datelog: string;
}

export interface MegaRemittanceReportItem extends MegaReportBase {
  transaction: string;
  full_name: string;
  province: string;
  municipality: string;
  status: ReportStatusEnum;
  payment_type: ReportPaymentMethodsEnum;
  address: string;
  paid: number;
  received: number;
  receivedCurrency: string;
  type: 'DEPOSIT' | 'DELIVERY';
  card: string;
  document: string;
  instructions: string;
  charged: number;
  created_date: string;
  received_date?: string;
}

export interface MegaStoreReportItem extends MegaReportBase {
  created_date: string;
  order_status: ReportStatusEnum;
  payment_method: ReportPaymentMethodsEnum;
  reference: string;
  order_total: number;
}

export interface MegaReferralReportItem extends MegaReportBase {
  id: number;
  amount: string;
  balance_end: string;
  balance_initial: string;
  category: ReportReferralCategoryEnum;
  created: string;
  notes: string;
  receiver_serial: number;
  submitted: string;
  zelle_email: string;
  zelle_phone: string;
  status: 1 | 2 | 3;
}
