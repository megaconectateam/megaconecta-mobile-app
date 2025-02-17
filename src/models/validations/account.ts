import * as yup from 'yup';

export type AccountSchemaType = yup.InferType<typeof accountSchema>;

export const accountSchema = yup
  .object()
  .shape({
    firstName: yup.string().required('accountSection.validations.firstName'),
    lastName: yup.string().required('accountSection.validations.lastName'),
    email: yup
      .string()
      .email('accountSection.validations.emailInvalid')
      .required('accountSection.validations.email'),
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
    promoSms: yup.bool().optional(),
  })
  .required();

export type ChangePasswordSchemaType = yup.InferType<
  typeof changePasswordSchema
>;

export const changePasswordSchema = yup
  .object()
  .shape({
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
