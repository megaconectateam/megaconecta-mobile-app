import { ReportPaymentMethodsEnum } from '../models/enums';

export const MegaConstants = {
  BalanceFee: 0.35,
};

export const PaymentMethodNames: { [key in ReportPaymentMethodsEnum]: string } =
  {
    [ReportPaymentMethodsEnum.cash]: 'CASH',
    [ReportPaymentMethodsEnum.amex]: 'AMEX',
    [ReportPaymentMethodsEnum.check]: 'CHECK',
    [ReportPaymentMethodsEnum.courtesy]: 'COURTESY',
    [ReportPaymentMethodsEnum.credit_card]: 'CREDIT CARD',
    [ReportPaymentMethodsEnum.discover]: 'DISCOVER',
    [ReportPaymentMethodsEnum.mastercard]: 'MASTERCARD',
    [ReportPaymentMethodsEnum.other]: 'OTHER',
    [ReportPaymentMethodsEnum.paypal]: 'PAYPAL',
    [ReportPaymentMethodsEnum.visa]: 'VISA',
  };

export const digitsWithAsterisk = [
  {
    number: '1',
    desc: '',
    margin: 'right',
  },
  {
    number: '2',
    desc: 'ABC',
    margin: 'center',
  },
  {
    number: '3',
    desc: 'DEF',
    margin: 'left',
  },
  {
    number: '4',
    desc: 'GHI',
    margin: 'right',
  },
  {
    number: '5',
    desc: 'JKL',
    margin: 'center',
  },
  {
    number: '6',
    desc: 'MNO',
    margin: 'left',
  },
  {
    number: '7',
    desc: 'PQRS',
    margin: 'right',
  },
  {
    number: '8',
    desc: 'TUV',
    margin: 'center',
  },
  {
    number: '9',
    desc: 'WXYZ',
    margin: 'left',
  },
  {
    number: '*',
    desc: '',
    margin: 'right',
  },
  {
    number: '0',
    desc: '+',
    margin: 'center',
  },
  {
    number: '#',
    desc: '',
    margin: 'left',
  },
];

export const digitsWithNoAsterisk = [
  {
    number: '1',
    desc: '',
    margin: 'right',
  },
  {
    number: '2',
    desc: 'ABC',
    margin: 'center',
  },
  {
    number: '3',
    desc: 'DEF',
    margin: 'left',
  },
  {
    number: '4',
    desc: 'GHI',
    margin: 'right',
  },
  {
    number: '5',
    desc: 'JKL',
    margin: 'center',
  },
  {
    number: '6',
    desc: 'MNO',
    margin: 'left',
  },
  {
    number: '7',
    desc: 'PQRS',
    margin: 'right',
  },
  {
    number: '8',
    desc: 'TUV',
    margin: 'center',
  },
  {
    number: '9',
    desc: 'WXYZ',
    margin: 'left',
  },
  {
    number: '',
    desc: '',
    margin: 'right',
  },
  {
    number: '0',
    desc: '+',
    margin: 'center',
  },
  {
    number: 'delete',
    desc: '',
    margin: 'left',
  },
];

export const NAUTA_SUFFIX = '@nauta.com.cu';

export const creditCardMasks = {
  visa: [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  amex: [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
};

export const creditCardExpirationMask = [/\d/, /\d/, ' / ', /\d/, /\d/];
