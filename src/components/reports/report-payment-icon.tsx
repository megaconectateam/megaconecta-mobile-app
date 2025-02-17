import { SVGs } from '../../assets/svg';
import { ReportPaymentMethodsEnum } from '../../models/enums';

export type ReportPaymentIconProps = {
  paymentMethod: ReportPaymentMethodsEnum;
  width?: number;
  height?: number;
  opacity?: number;
};

export const ReportPaymentIcon = ({
  paymentMethod,
  width = 25,
  height = 25,
  opacity = 1,
}: ReportPaymentIconProps) => {
  switch (paymentMethod) {
    case ReportPaymentMethodsEnum.cash:
      return (
        <SVGs.Payment.CashIcon
          width={width}
          height={height}
          style={{ opacity }}
        />
      );
    case ReportPaymentMethodsEnum.check:
      return (
        <SVGs.Payment.CheckIcon
          width={width}
          height={height}
          style={{ opacity }}
        />
      );
    case ReportPaymentMethodsEnum.amex:
      return (
        <SVGs.Payment.AmexReportIcon
          width={width}
          height={height}
          style={{ opacity }}
        />
      );
    case ReportPaymentMethodsEnum.visa:
      return (
        <SVGs.Payment.VisaIcon
          width={width}
          height={height}
          style={{ opacity }}
        />
      );
    case ReportPaymentMethodsEnum.mastercard:
      return (
        <SVGs.Payment.MasterCardIcon
          width={width}
          height={height}
          style={{ opacity }}
        />
      );
    case ReportPaymentMethodsEnum.discover:
      return (
        <SVGs.Payment.DiscoverIcon
          width={width}
          height={height}
          style={{ opacity }}
        />
      );
    case ReportPaymentMethodsEnum.courtesy:
      return (
        <SVGs.Payment.CourtesyIcon
          width={width}
          height={height}
          style={{ opacity }}
        />
      );
    case ReportPaymentMethodsEnum.credit_card:
      return (
        <SVGs.Payment.CreditCardIcon
          width={width}
          height={height}
          style={{ opacity }}
        />
      );
    case ReportPaymentMethodsEnum.paypal:
      return (
        <SVGs.Payment.PaypalIcon
          width={width}
          height={height}
          style={{ opacity }}
        />
      );
    case ReportPaymentMethodsEnum.other:
      return (
        <SVGs.Payment.OtherPaymentIcon
          width={width}
          height={height}
          style={{ opacity }}
        />
      );
  }

  return null;
};
