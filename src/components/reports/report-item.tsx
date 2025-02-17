import { SectionListData, StyleSheet, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import {
  MegaFundReportItem,
  MegaRemittanceReportItem,
  MegaReportBase,
  MegaStoreReportItem,
  MegaTopUpReportItem,
  SectionItem,
} from '../../models';
import { ReportPaymentMethodsEnum, ReportTypesEnum } from '../../models/enums';
import { Colors } from '../../themes';
import { MegaGradient } from '../ui';
import {
  ReportMarketContent,
  ReportPaymentContent,
  ReportRemittanceContent,
  ReportTopupContent,
} from './report-item-content';
import { ReportPaymentIcon } from './report-payment-icon';

export type ReportItemProps = {
  item: MegaReportBase;
  index: number;
  section: SectionListData<MegaReportBase, SectionItem<MegaReportBase>>;
};

export const ReportItem = ({ item, index, section }: ReportItemProps) => {
  // console.log('item', item);

  const paymentType: ReportPaymentMethodsEnum | undefined =
    item.reportType === ReportTypesEnum.payment
      ? (item as MegaFundReportItem).payment_type
      : item.reportType === ReportTypesEnum.topup
      ? (item as MegaFundReportItem).payment_type
      : undefined;

  let icon: JSX.Element | null = null;
  if (item.reportType === ReportTypesEnum.remittance) {
    icon = <SVGs.RemesasIcon width={25} height={25} />;
  }

  if (item.reportType === ReportTypesEnum.market) {
    icon = <SVGs.MarketIcon width={25} height={25} />;
  }

  let content: JSX.Element | null = null;
  switch (item.reportType) {
    case ReportTypesEnum.topup:
      content = <ReportTopupContent data={item as MegaTopUpReportItem} />;
      break;

    case ReportTypesEnum.payment:
      content = <ReportPaymentContent data={item as MegaFundReportItem} />;
      break;

    case ReportTypesEnum.market:
      content = <ReportMarketContent data={item as MegaStoreReportItem} />;
      break;

    case ReportTypesEnum.remittance:
      content = (
        <ReportRemittanceContent data={item as MegaRemittanceReportItem} />
      );
      break;
  }

  return (
    <View
      style={[
        styles.rowContainer,
        index === 0 && styles.rowContainerFirst,
        index === section.data.length - 1 && styles.rowContainerLast,
      ]}
    >
      <View>
        <MegaGradient styles={styles.iconGradient}>
          {!!paymentType && <ReportPaymentIcon paymentMethod={paymentType} />}
          {!!icon && icon}
        </MegaGradient>
      </View>
      <View
        style={[
          styles.rowSecondHalfContainer,
          index === section.data.length - 1 &&
            styles.lastRowSecondHalfContainer,
        ]}
      >
        {content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainerFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowContainerLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowSecondHalfContainer: {
    flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    marginLeft: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197, 197, 197, 0.5)',
  },
  lastRowSecondHalfContainer: {
    borderBottomWidth: 0,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
