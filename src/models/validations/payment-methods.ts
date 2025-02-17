import creditCardType from 'credit-card-type';
import { CreditCardType } from 'credit-card-type/dist/types';
import { startsWith, toLower } from 'lodash';
import moment from 'moment';
import * as yup from 'yup';
import { GenericList } from '../genericList';

const baseCardShape = {
  country: yup
    .object<GenericList>()
    .shape({
      value: yup.string().required(),
      label: yup.string().required(),
      extraLabel: yup.string().optional(),
      phoneMask: yup.string().optional(),
      icon: yup.object().optional(),
    })
    .required('paymentMethodsSection.validations.countryRequired'),
  address1: yup
    .string()
    .required('paymentMethodsSection.validations.address1Required'),
  cardExpiration: yup
    .string()
    .required('paymentMethodsSection.validations.cardExpirationRequired')
    .test(
      'cardExp',
      'paymentMethodsSection.validations.cardExpirationNotValid',
      (value) => {
        if (!value) {
          return true;
        }

        if (value.length !== 4) {
          return false;
        }

        return true;
      },
    )
    .test(
      'cardExp',
      'paymentMethodsSection.validations.cardExpirationPast',
      (value) => {
        if (!value) {
          return true;
        }

        if (value.length !== 4) {
          return false;
        }

        const month = (value.substring(0, 2) || '').trim();
        const year = (value.substring(2, 4) || '').trim();

        const today = moment();
        const ccDate = moment(`${year}${month}`, 'YYMM');

        return ccDate.isValid() && ccDate.endOf('month').isSameOrAfter(today);
      },
    ),
  cardCvc: yup
    .string()
    .required('paymentMethodsSection.validations.cardCvcRequired')
    .test(
      'cardCvc',
      'paymentMethodsSection.validations.cardCvcFormat',
      (value, context) => {
        if (!value) {
          return true;
        }

        if (!context.parent.cardNumber) {
          return true;
        }

        if (
          startsWith(context.parent.cardNumber, '····') ||
          startsWith(context.parent.cardNumber, 'XXXX')
        ) {
          return true;
        }

        const ccType = creditCardType(context.parent.cardNumber);
        if (ccType[0].type === 'american-express') {
          return `${value}`.trim().length === 4;
        } else {
          return `${value}`.trim().length === 3;
        }
      },
    ),
  city: yup.string().required('paymentMethodsSection.validations.cityRequired'),
  state: yup
    .string()
    .required('paymentMethodsSection.validations.stateRequired'),
  zip: yup
    .string()
    .required('paymentMethodsSection.validations.zipRequired')
    .test(
      'zip',
      'paymentMethodsSection.validations.zipFormat',
      (value, context) => {
        if (!value) {
          return true;
        }

        if (!context.parent.country) {
          return true;
        }

        if (toLower(context.parent.country.value) === 'us') {
          return /^\d{5}$/.test(value);
        }

        return true;
      },
    ),
};

export const newCardSchema = yup
  .object()
  .shape({
    cardNumber: yup
      .string()
      .required('paymentMethodsSection.validations.cardNumberRequired')
      .test(
        'creditCard',
        'paymentMethodsSection.validations.cardNumberFormat',
        (value) => {
          console.log('cc', value);

          const types: CreditCardType[] = creditCardType(value);
          if (types.length !== 1) {
            return false;
          }

          if (value.length !== types[0].lengths[0]) {
            return false;
          }

          return true;
        },
      ),
    storeCcAccount: yup.bool().optional(),
    firstName: yup
      .string()
      .required('paymentMethodsSection.validations.firstNameRequired'),
    lastName: yup
      .string()
      .required('paymentMethodsSection.validations.lastNameRequired'),
    ...baseCardShape,
  })
  .required();

export const existingCardSchema = yup.object().shape(baseCardShape).required();

export type newCardSchemaType = yup.InferType<typeof newCardSchema>;
export type existingCardSchemaType = yup.InferType<typeof existingCardSchema>;
