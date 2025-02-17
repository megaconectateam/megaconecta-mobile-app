export enum FutureEnum {
  none = 'none',
  future = 'future',
  now = 'now',
}

export enum ReportTypesEnum {
  topup = 'topup',
  payment = 'payment',
  market = 'market',
  remittance = 'remittance',
  referral = 'referral',
}

export enum ReportStatusEnum {
  pending = 'pending',
  in_process = 'in_process',
  completed = 'completed',
  cancelled = 'cancelled',
  returned = 'returned',
  approved = 'approved',
  rejected = 'rejected',
  refunded = 'refunded',
}

export enum ReportPaymentMethodsEnum {
  credit_card = 'credit_card',
  paypal = 'paypal',
  cash = 'cash',
  other = 'other',
  check = 'check',
  visa = 'visa',
  mastercard = 'mastercard',
  amex = 'amex',
  discover = 'discover',
  courtesy = 'courtesy',
}

export enum ReportReferralCategoryEnum {
  FUNDS = 'FUNDS',
  DEDUCT_FUNDS = 'DEDUCT_FUNDS',
  DEDUCT_TOPUP = 'DEDUCT_TOPUP',
  WITHDRAW_ZELLE = 'WITHDRAW_ZELLE',
  REFUND_TOPUP = 'REFUND_TOPUP',
  REFUND_FUNDS = 'REFUND_FUNDS',
}
