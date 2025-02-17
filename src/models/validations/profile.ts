import { toLower } from 'lodash';
import * as yup from 'yup';
import { GenericList } from '../genericList';

export type ProfileSchemaType = yup.InferType<typeof profileSchema>;

export const profileSchema = yup.object().shape({
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
});
