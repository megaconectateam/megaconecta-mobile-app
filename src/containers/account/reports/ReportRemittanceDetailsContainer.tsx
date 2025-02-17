import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { toLower } from 'lodash';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useQuery } from 'react-query';
import { SVGs } from '../../../assets/svg';
import { ReportStatus } from '../../../components/reports/repot-status';
import {
    Flag,
    FontType,
    MegaText,
    ScreenWithKeyboard,
} from '../../../components/ui';
import { MegaRemittanceReportItem, QueryTypes } from '../../../models';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { useLoadingContext } from '../../../providers';
import { ProfileContext } from '../../../providers/ProfileProvider';
import { ReportsServices } from '../../../services';
import { Colors, themeStyles } from '../../../themes';
import {
    PaymentMethodNames,
    currencyFormat,
    formatCardNumber,
} from '../../../utils';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'ReportRemittanceDetailsContainer'
>;

export const ReportRemittanceDetailsContainer = ({ route }: Props) => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { profile } = useContext(ProfileContext);

  const [id] = useState<number>(route.params.id);
  const [date, setDate] = useState<moment.Moment | null>(null);
  const [remittance, setRemittance] = useState<MegaRemittanceReportItem>();

  const remittanceDetailsQuery = useQuery(
    [QueryTypes.GetRemittanceReportDetails, id],
    () => {
      if (id) {
        setLoading(true);
        return ReportsServices.getRemittanceDetails(id);
      }
    },
    {
      onSettled: () => {
        setLoading(false);
      },
    },
  );

  useEffect(() => {
    if (remittanceDetailsQuery.status === 'success') {
      setRemittance(remittanceDetailsQuery.data);
      setDate(
        moment(remittanceDetailsQuery.data?.created_date, 'DD/MM/YYYY HH:mm a'),
      );
    }
  }, [remittanceDetailsQuery.data]);

  if (!remittance) {
    return null;
  }

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
          <MegaText size={15}>{t('reportsSection.received')}</MegaText>
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
            size={44}
            font={FontType.medium}
            styles={{ lineHeight: 54, color: Colors.primary }}
          >
            {Number(remittance.received).toFixed(2)}
          </MegaText>

          <MegaText
            size={30}
            styles={{
              lineHeight: 36,
              color: Colors.darkGreen,
              paddingBottom: 5,
            }}
          >
            {remittance.receivedCurrency}
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
            {PaymentMethodNames[remittance.payment_type]}
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
            {remittance.transaction}
          </MegaText>
        </View>
        <View>
          <ReportStatus status={remittance.status} overrideTextColor />
        </View>

        <View style={{ marginTop: 30 }}>
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{ lineHeight: 21, color: Colors.primary }}
          >
            {t('reportsSection.deliveryContact')}
          </MegaText>
        </View>

        <View style={styles.sectionWrapper}>
          <MegaText
            size={16}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {remittance.full_name}
          </MegaText>
          <View style={{ flexDirection: 'row' }}>
            <MegaText size={13} styles={{ lineHeight: 25 }}>
              {t('mlcCard')}:{' '}
            </MegaText>
            <MegaText
              size={13}
              font={FontType.medium}
              styles={{ lineHeight: 25, color: Colors.primary }}
            >
              {formatCardNumber(remittance.card)}
            </MegaText>
          </View>
          <MegaText size={13} styles={{ lineHeight: 25 }}>
            {remittance.address}
          </MegaText>
          <MegaText size={13} styles={{ lineHeight: 20 }}>
            {remittance.municipality}, {remittance.province}
          </MegaText>
        </View>

        <View style={[styles.sectionWrapper]}>
          <View
            style={[
              styles.imageWrapper,
              {
                marginTop: 5,
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {profile && (
                <Flag
                  name={toLower(profile.user.address.country)}
                  styles={{ width: 50, height: 50, marginRight: 10 }}
                />
              )}
              <View>
                <View>
                  <View>
                    <MegaText
                      size={16}
                      font={FontType.medium}
                      styles={{ lineHeight: 24, color: Colors.primary }}
                    >
                      {currencyFormat(Number(remittance.paid))}
                    </MegaText>
                  </View>
                  <MegaText size={13} styles={{ lineHeight: 18 }}>
                    {t('reportsSection.sent')}
                  </MegaText>
                </View>
              </View>
            </View>
            <View>
              <SVGs.ArrowListItem fill="#C5C5C5" width={15} height={15} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Flag
                name="cu"
                styles={{ width: 50, height: 50, marginRight: 10 }}
              />

              <View>
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <MegaText
                      size={16}
                      font={FontType.medium}
                      styles={{ lineHeight: 24, color: Colors.primary }}
                    >
                      {Number(remittance.received).toFixed(2)}
                    </MegaText>
                    <MegaText
                      size={16}
                      font={FontType.medium}
                      styles={{ lineHeight: 24, color: Colors.darkGreen }}
                    >
                      {' '}
                      {remittance.receivedCurrency}
                    </MegaText>
                  </View>
                  <MegaText size={13} styles={{ lineHeight: 18 }}>
                    {t('reportsSection.received')}
                  </MegaText>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.sectionWrapper, { marginBottom: 30 }]}>
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
                {currencyFormat(Number(remittance.paid))}
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
