import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import {
  MegaFundReportItem,
  MegaRemittanceReportItem,
  MegaStoreReportItem,
  MegaTopUpReportItem,
} from '../../models';
import { Colors } from '../../themes';
import { PaymentMethodNames, currencyFormat } from '../../utils';
import { FontType, MegaButton, MegaText } from '../ui';
import { ReportStatus } from './repot-status';

export const ReportTopupContent = ({ data }: { data: MegaTopUpReportItem }) => {
  const { t } = useTranslation();
  const mDate = moment(data.date);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={{ flexGrow: 1 }}>
          <MegaText
            size={15}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {PaymentMethodNames[data.payment_type]}
          </MegaText>
        </View>
        <View>
          <MegaText size={13} styles={{ lineHeight: 24 }}>
            {mDate.format('LT')}
          </MegaText>
        </View>
      </View>

      <View style={styles.headerWrapper}>
        <View style={{ flexGrow: 1 }}>
          <MegaText
            size={13}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {data.approval_code}
          </MegaText>
        </View>
        <View>
          <MegaText size={13} styles={{ lineHeight: 24 }}>
            <ReportStatus status={data.status} />
          </MegaText>
        </View>
      </View>

      <View style={styles.headerWrapper}>
        <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
          Cel:
        </MegaText>

        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: Colors.primary }}
        >
          {data.destination}
        </MegaText>
      </View>

      <View style={styles.headerWrapper}>
        <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
          {t('reportsSection.paid')}:
        </MegaText>

        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: Colors.primary }}
        >
          {currencyFormat(Number(data.total_price))}
        </MegaText>
      </View>

      <View style={styles.headerWrapper}>
        <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
          {t('reportsSection.received')}:
        </MegaText>

        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: Colors.primary }}
        >
          {data.received_product}
        </MegaText>
      </View>

      {data.promotion && (
        <View style={styles.headerWrapper}>
          <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
            {t('reportsSection.promotion')}:
          </MegaText>

          <MegaText
            size={13}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {data.promotion}
          </MegaText>
        </View>
      )}
    </View>
  );
};

export const ReportPaymentContent = ({
  data,
}: {
  data: MegaFundReportItem;
}) => {
  const { t } = useTranslation();
  const mDate = moment(data.date);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={{ flexGrow: 1 }}>
          <MegaText
            size={15}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {PaymentMethodNames[data.payment_type]}
          </MegaText>
        </View>
        <View>
          <MegaText size={13} styles={{ lineHeight: 24 }}>
            {mDate.format('LT')}
          </MegaText>
        </View>
      </View>

      <View style={styles.headerWrapper}>
        <View style={{ flexGrow: 1 }}>
          <MegaText
            size={13}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {data.approval_code}
          </MegaText>
        </View>
        <View>
          <MegaText size={13} styles={{ lineHeight: 24 }}>
            <ReportStatus status={data.status} />
          </MegaText>
        </View>
      </View>

      <View style={styles.headerWrapper}>
        <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
          {t('reportsSection.paid')}:
        </MegaText>

        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: Colors.primary }}
        >
          {currencyFormat(Number(data.amount_charged))}
        </MegaText>
      </View>

      <View style={styles.headerWrapper}>
        <View style={{ flexDirection: 'row' }}>
          <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
            {t('reportsSection.received')}:
          </MegaText>

          <MegaText
            size={13}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {currencyFormat(Number(data.amount_added))}
          </MegaText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 5,
          }}
        >
          <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
            | {t('reportsSection.balance')}:
          </MegaText>

          <MegaText
            size={13}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {currencyFormat(Number(data.new_balance))}
          </MegaText>
        </View>
      </View>
    </View>
  );
};

export const ReportMarketContent = ({
  data,
}: {
  data: MegaStoreReportItem;
}) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const mDate = moment(data.date);

  const navigateToDetails = () => {
    navigate('ReportStoreDetailsContainer', {
      orderId: Number(data.id),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={{ flexGrow: 1 }}>
          <MegaText
            size={15}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {PaymentMethodNames[data.payment_method]}
          </MegaText>
        </View>
        <View>
          <MegaText size={13} styles={{ lineHeight: 24 }}>
            {mDate.format('LT')}
          </MegaText>
        </View>
      </View>

      <View style={styles.headerWrapper}>
        <View style={{ flexGrow: 1 }}>
          <MegaText
            size={13}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {data.reference}
          </MegaText>
        </View>
        <View>
          <MegaText size={13} styles={{ lineHeight: 24 }}>
            <ReportStatus status={data.order_status} />
          </MegaText>
        </View>
      </View>

      <View style={styles.headerWrapper}>
        <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
          {t('reportsSection.paid')}:
        </MegaText>

        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: Colors.primary }}
        >
          {currencyFormat(Number(data.order_total))}
        </MegaText>
      </View>

      <View style={styles.headerWrapper}>
        <MegaButton
          variant="link"
          text={t('viewDetails')}
          linkVariant="dark"
          height={30}
          iconRight={
            <SVGs.ArrowListItem
              width={15}
              height={15}
              fill={Colors.darkerGreen}
            />
          }
          onPress={navigateToDetails}
        />
      </View>
    </View>
  );
};

export const ReportRemittanceContent = ({
  data,
}: {
  data: MegaRemittanceReportItem;
}) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const mDate = moment(data.date);

  const navigateToDetails = () => {
    navigate('ReportRemittanceDetailsContainer', {
      id: Number(data.id),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={{ flexGrow: 1 }}>
          <MegaText
            size={15}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {PaymentMethodNames[data.payment_type]}
          </MegaText>
        </View>
        <View>
          <MegaText size={13} styles={{ lineHeight: 24 }}>
            {mDate.format('LT')}
          </MegaText>
        </View>
      </View>

      <View style={styles.headerWrapper}>
        <View style={{ flexGrow: 1 }}>
          <MegaText
            size={13}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {data.transaction}
          </MegaText>
        </View>
        <View>
          <MegaText size={13} styles={{ lineHeight: 24 }}>
            <ReportStatus status={data.status} />
          </MegaText>
        </View>
      </View>

      <View style={styles.headerWrapper}>
        <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
          {t('reportsSection.paid')}:
        </MegaText>

        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: Colors.primary }}
        >
          {currencyFormat(Number(data.paid))}
        </MegaText>
      </View>

      <View style={styles.headerWrapper}>
        <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
          {t('reportsSection.received')}:
        </MegaText>

        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: Colors.primary }}
        >
          {currencyFormat(Number(data.received))}
        </MegaText>

        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: Colors.darkGreen }}
        >
          {' '}
          {data.receivedCurrency}
        </MegaText>
      </View>

      <View style={styles.headerWrapper}>
        <MegaText size={13} styles={{ lineHeight: 24, marginRight: 5 }}>
          {t('reportsSection.deliveryType')}:
        </MegaText>

        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: Colors.primary }}
        >
          {data.type === 'DELIVERY'
            ? t('reportsSection.inHome')
            : t('reportsSection.deposit')}
        </MegaText>
      </View>

      <View style={styles.headerWrapper}>
        <MegaButton
          variant="link"
          text={t('viewDetails')}
          linkVariant="dark"
          height={30}
          iconRight={
            <SVGs.ArrowListItem
              width={15}
              height={15}
              fill={Colors.darkerGreen}
            />
          }
          onPress={navigateToDetails}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
  },
});
