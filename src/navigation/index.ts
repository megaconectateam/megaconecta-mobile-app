import { GenericList, MegaContact, PaymentMethodCard } from '../models';
import { ReportTypesEnum } from '../models/enums';
import { TabStackParamList } from './tabs';

export * from './root';
export * from './tabs';

export type RootStackParamList = {
  Splash: undefined;
  OnBoard: undefined;
  Login: undefined;
  LoginSms: undefined;
  SmsVerification: { phone: string; country: string };
  CreateAccount: undefined;
  ForgotPasswordContainer: undefined;
  ChangePasswordContainer: undefined;
  tabs: undefined;
  CountrySelectorModal: { countryList: GenericList[]; onSelectItem: Function };
  GenericSelectorModal: { itemList: GenericList[]; onSelectItem: Function };
  CountrySelector: { countryList: GenericList[]; onSelectItem: Function };
  GenericSelector: { itemList: GenericList[]; onSelectItem: Function };
  AddFunds: undefined;
  ContactEditionRoute: {
    isNewContact: boolean;
    editContact?: MegaContact;
    acceptRemittance: boolean;
  };
  ContactEditionContainer: {
    isNewContact: boolean;
    editContact?: MegaContact;
    acceptRemittance: boolean;
  };
  CreditCardFormRoute: {
    existingCard?: PaymentMethodCard;
  };
  CreditCardFormContainer: {
    existingCard?: PaymentMethodCard;
  };

  ReportsContainer: {
    defaultPage?: ReportTypesEnum;
  };
  ReportStoreDetailsContainer: {
    orderId: number;
  };
  ReportRemittanceDetailsContainer: {
    id: number;
  };
  MegaContactAddressContainer: undefined;
  PaymentMethodsContainer: undefined;
  AccountPasswordContainer: undefined;
  GetPromotionsContainer: undefined;
  EditAccountContainer: undefined;
  CustomerSupportContainer: undefined;
  TermAndConditionsContainer: undefined;
  PrivacyPolicyContainer: undefined;
  ReferralContainer: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList, TabStackParamList {}
  }
}
