import * as yup from 'yup';

export const referralSchema = yup
  .object()
  .shape({
    firstName: yup
      .string()
      .required('paymentMethodsSection.validations.firstNameRequired'),
    lastName: yup
      .string()
      .required('paymentMethodsSection.validations.lastNameRequired'),
    zelleAccountType: yup
      .string()
      .oneOf(['phone', 'email'])
      .default('phone')
      .required('referralSection.zelleTypeRequired'),
    zellePhone: yup
      .string()

      .test('zellePhone', 'phoneRequired', (value, context) => {
        if (context.parent.zelleAccountType === 'phone') {
          return yup.string().required().isValidSync(value);
        }

        return true;
      }),
    zelleEmail: yup
      .string()
      .email('accountSection.validations.emailInvalid')
      .test('zelleEmail', 'validationEmail', (value, context) => {
        if (context.parent.zelleAccountType === 'email') {
          return yup.string().required().isValidSync(value);
        }

        return true;
      }),
  })
  .required();

export type ReferralSchemaType = yup.InferType<typeof referralSchema>;
