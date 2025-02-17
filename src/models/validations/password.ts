import * as yup from 'yup';

export const accountPasswordSchema = yup
  .object()
  .shape({
    currentPassword: yup
      .string()
      .required('accountSection.validations.currentPassword'),

    password: yup
      .string()
      .min(4, 'accountSection.validations.passwordInvalid')
      .required('accountSection.validations.password'),

    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref('password'), undefined],
        'accountSection.validations.passwordMatch',
      )
      .required('accountSection.validations.password'),
  })
  .required();

export type AccountPasswordSchemaType = yup.InferType<
  typeof accountPasswordSchema
>;
