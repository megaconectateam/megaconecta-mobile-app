export enum QueryTypes {
  GetAuthCountries = 'get/authCountries',
  GetAutoRechargeData = 'get/autoRechargeData',
  GetBalance = 'get/balance',
  GetBlacklistedPhone = 'get/phone/blacklisted',
  GetCallReport = 'get/call/report',
  GetCarrierByPhone = 'get/carrier/byPhone',
  GetRemittanceAmounts = 'get/remittances/amounts',
  GetRemittanceTotal = 'get/remittances/total',
  GetContacts = 'get/contacts',
  GetCountriesForCall = 'get/call/countries',
  GetCallRate = 'get/call/rate',
  GetCountriesForContact = 'get/countries/contacts',
  GetCountriesForTopUp = 'get/countries/topup',
  GetCountriesForBundle = 'get/countries/bundle',
  GetFundProducts = 'get/fund/products',
  GetPaymentMethods = 'get/paymentMethods',
  GetProfile = 'get/profile',
  GetReferralBalance = 'get/referralBalance',
  GetReferralReport = 'get/referral/report',
  GetSmsRateCountries = 'get/sms/rate/countries',
  GetSmsReport = 'get/sms/report',
  GetSmsConversation = 'get/sms/conversation',
  GetStoreMunicipalities = 'get/store/municipalities',
  GetStoreProductCategories = 'get/store/product/categories',
  GetStoreProductLocations = 'get/store/product/locations',
  GetStoreProductTypes = 'get/store/product/types',
  GetStoreProducts = 'get/store/products',
  GetPromotedProducts = 'get/store/promotedProducts',
  GetStoreProvinces = 'get/store/provinces',
  GetRemittanceReportDetails = 'get/remittance/report/details',
  GetStoreReportDetails = 'get/store/report/details',
  GetTopUpCarrierRates = 'get/topup/carrierRates',
  GetTopUpCarriers = 'get/topup/carriers',
  GetTopUpInitialData = 'get/topup/initialData',
  GetPromoContent = 'get/promotions/getContent',
  GetPromoContents = 'get/promotions/getContents',
  GetContent = 'get/getContent/',

  // reports
  // GetRemittanceReport = 'get/remittance/report',
  // GetFundReport = 'get/fund/report',
  // GetStoreReport = 'get/store/report',
  // GetTopUpReport = 'get/topup/report',
  GetReport = 'get/report/',
}
