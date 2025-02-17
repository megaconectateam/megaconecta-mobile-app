import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { useQuery } from 'react-query';
import { SVGs } from '../../../assets/svg';
import { ReportStatus } from '../../../components/reports/repot-status';
import { FontType, MegaText, ScreenWithKeyboard } from '../../../components/ui';
import {
  MegaStoreOrder,
  MegaStoreOrderDetail,
  QueryTypes,
} from '../../../models';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { useLoadingContext } from '../../../providers';
import { ReportsServices } from '../../../services';
import { Colors, themeStyles } from '../../../themes';
import { PaymentMethodNames, currencyFormat } from '../../../utils';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'ReportStoreDetailsContainer'
>;

export const ReportStoreDetailsContainer = ({ route }: Props) => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();

  const [orderId] = useState<number>(route.params.orderId);
  const [date, setDate] = useState<moment.Moment | null>(null);
  const [order, setOrder] = useState<MegaStoreOrder>();
  const [product, setProduct] = useState<MegaStoreOrderDetail>();

  const orderDetailsQuery = useQuery(
    [QueryTypes.GetStoreReportDetails, orderId],
    () => {
      if (orderId) {
        setLoading(true);
        return ReportsServices.getStoreOrderDetails(orderId);
      }
    },
    {
      onSettled: () => {
        setLoading(false);
      },
    },
  );

  useEffect(() => {
    if (orderDetailsQuery.status === 'success') {
      setOrder(orderDetailsQuery.data);
      setDate(
        moment(orderDetailsQuery.data?.created_date, 'DD/MM/YYYY HH:mm a'),
      );

      if (
        orderDetailsQuery.data?.details &&
        orderDetailsQuery.data?.details.length > 0
      ) {
        setProduct(orderDetailsQuery.data?.details[0]);
      }
    }
  }, [orderDetailsQuery.data]);

  if (!order || !product) return null;

  return (
    <ScreenWithKeyboard useBottomSafeview>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ marginTop: 5 }}>
          <MegaText size={15}>{t('reportsSection.paid')}</MegaText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            marginTop: 5,
          }}
        >
          <MegaText
            size={30}
            styles={{
              lineHeight: 36,
              color: Colors.darkGreen,
              paddingBottom: 5,
            }}
          >
            $
          </MegaText>
          <MegaText
            size={44}
            font={FontType.medium}
            styles={{ lineHeight: 54, color: Colors.primary }}
          >
            {Number(order?.order_total).toFixed(2)}
          </MegaText>
        </View>
        <View style={{ marginTop: 5 }}>
          <MegaText size={15}>
            {t('date')}: {date?.format('DD/MM/YYYY')}
          </MegaText>
        </View>

        <View style={{ marginTop: 30 }}>
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{ color: Colors.primary }}
          >
            {PaymentMethodNames[order.payment_method]}
          </MegaText>
        </View>
        <View style={{ marginTop: 5, flexDirection: 'row' }}>
          <MegaText size={15} styles={{ lineHeight: 21 }}>
            {t('reportsSection.transactionNo')}
          </MegaText>
          <MegaText
            size={15}
            font={FontType.medium}
            styles={{ color: Colors.primary, lineHeight: 21 }}
          >
            {' '}
            {order.reference}
          </MegaText>
        </View>
        <View>
          <ReportStatus status={order.order_status} />
        </View>

        <View style={{ marginTop: 30 }}>
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{ lineHeight: 21, color: Colors.primary }}
          >
            {t('reportsSection.deliveryAddress')}
          </MegaText>
        </View>

        <View style={styles.sectionWrapper}>
          <MegaText
            size={16}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {order.full_name}
          </MegaText>
          <MegaText size={13} styles={{ lineHeight: 25 }}>
            {order.address1}
          </MegaText>
          <MegaText size={13} styles={{ lineHeight: 20 }}>
            {order.city}, {order.state}
          </MegaText>
        </View>

        <View style={{ marginTop: 30 }}>
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{ lineHeight: 21, color: Colors.primary }}
          >
            {t('products')}
          </MegaText>
        </View>

        <View style={[styles.sectionWrapper]}>
          <View style={styles.imageWrapper}>
            <View>
              {/* TODO: this is a placeholder image, use the good ones once they are ready */}
              <Image
                source={{ uri: product.product.main_image.image_url }}
                width={100}
                // height={100}
              />
            </View>
            <View style={{ flexGrow: 1 }}>
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ lineHeight: 21, color: Colors.primary }}
              >
                {product.product.name}
              </MegaText>

              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <MegaText
                  size={13}
                  styles={{
                    lineHeight: 18,
                    color: Colors.primary,
                    flex: 1,
                    flexWrap: 'wrap',
                  }}
                  nativeProps={{
                    numberOfLines: 3,
                    ellipsizeMode: 'tail',
                  }}
                >
                  {product.product.description}
                </MegaText>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <MegaText
                  size={16}
                  font={FontType.medium}
                  styles={{ lineHeight: 24, color: Colors.primary }}
                >
                  {currencyFormat(Number(product.subtotal))}
                </MegaText>
              </View>
            </View>
          </View>
          {product.product.deliveries.map((d) => (
            <View
              key={d.id}
              style={{
                flexDirection: 'row',
                marginTop: 5,
                alignItems: 'center',
              }}
            >
              <SVGs.DeliveryIcon
                width={20}
                height={20}
                style={{ marginRight: 5 }}
              />
              <MegaText size={13} styles={{ lineHeight: 22 }}>
                {d.name}:
              </MegaText>
              <MegaText
                size={13}
                font={FontType.medium}
                styles={{ lineHeight: 22, color: Colors.primary }}
              >
                {' '}
                {d.duration}
              </MegaText>
            </View>
          ))}
        </View>

        <View style={[styles.sectionWrapper, { marginBottom: 30 }]}>
          <View style={[styles.imageWrapper, { marginTop: 5 }]}>
            <View style={{ flexGrow: 1 }}>
              <MegaText
                size={15}
                styles={{ lineHeight: 21, color: Colors.primary }}
              >
                {t('reportsSection.subtotal')}
              </MegaText>
            </View>
            <View>
              <MegaText
                size={15}
                styles={{ lineHeight: 21, color: Colors.primary }}
              >
                {currencyFormat(Number(product.subtotal))}
              </MegaText>
            </View>
          </View>

          <View style={[styles.imageWrapper, { marginTop: 5 }]}>
            <View style={{ flexGrow: 1 }}>
              <MegaText
                size={15}
                styles={{ lineHeight: 21, color: Colors.primary }}
              >
                {t('reportsSection.deliveryCost')}
              </MegaText>
            </View>
            <View>
              <MegaText
                size={15}
                styles={{ lineHeight: 21, color: Colors.primary }}
              >
                {'+ '}
                {currencyFormat(Number(order.delivery_total))}
              </MegaText>
            </View>
          </View>

          <View style={[styles.imageWrapper, { marginTop: 5 }]}>
            <View style={{ flexGrow: 1 }}>
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ lineHeight: 21, color: Colors.primary }}
              >
                {t('reportsSection.totalPaid')}
              </MegaText>
            </View>
            <View>
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ lineHeight: 21, color: Colors.primary }}
              >
                {currencyFormat(Number(order.order_total))}
              </MegaText>
            </View>
          </View>
        </View>
      </View>
    </ScreenWithKeyboard>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    ...themeStyles.shadow,
    width: '100%',
    marginTop: 16,
  },
  imageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
