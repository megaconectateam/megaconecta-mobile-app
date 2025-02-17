import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  Switch,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useQuery } from 'react-query';
import { SVGs } from '../../../assets/svg';
import { AutoRecargaModal } from '../../../components';
import {
  FontType,
  MegaButton,
  MegaText,
  ScreenWithKeyboard,
} from '../../../components/ui';
import {
  AutoRechargeFund,
  MegaFund,
  MegaFundSelector,
  QueryTypes,
} from '../../../models';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { useLoadingContext } from '../../../providers/LoadingProvider';
import { useGlobalModalContext } from '../../../providers/ModalProvider';
import { AccountServices, FundServices } from '../../../services';
import { Colors } from '../../../themes';
import {
  MegaConstants,
  currencyFormat,
  hasAutoRechargeInfo,
  isLoadingQueries,
} from '../../../utils';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'AddFunds'
>;

export const AddFundContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { showModal, hideModal } = useGlobalModalContext();
  const { setLoading } = useLoadingContext();

  const [autoRechargeInfo, setAutoRechargeInfo] =
    useState<AutoRechargeFund | null>(null);
  const [productList, settProductList] = useState<MegaFundSelector[]>([]);
  const [selectedFund, setSelectedFund] = useState<MegaFundSelector | null>(
    null,
  );
  const [isAutoRechargeModalVisible, setIsAutoRechargeModalVisible] =
    useState(false);

  const fundsQuery = useQuery(
    QueryTypes.GetFundProducts,
    FundServices.getFundProducts,
  );
  const profileQuery = useQuery(
    QueryTypes.GetProfile,
    AccountServices.getProfileData,
  );
  const autoRechargeQuery = useQuery(
    QueryTypes.GetAutoRechargeData,
    AccountServices.getAutoRechargeData,
  );

  useEffect(() => {
    setLoading(isLoadingQueries([fundsQuery, profileQuery]));
  }, [fundsQuery.status, profileQuery.status]);

  useEffect(() => {
    if (fundsQuery.status === 'success' && profileQuery.status === 'success') {
      let newProductList: MegaFund[] = [];

      if (profileQuery.data.user.new_account_promo.is_active) {
        newProductList.push({
          amount: profileQuery.data.user.new_account_promo.amount.toString(),
          bonus: '',
          label: `${profileQuery.data.user.new_account_promo.amount.toFixed(
            2,
          )}`,
        });
      }

      newProductList = [...newProductList, ...fundsQuery.data];

      const productSelectors: MegaFundSelector[] = newProductList.map(
        (item, index) => {
          return {
            id: `mega-price-${index}`,
            priceTitle: `$${item.amount}`,
            amount: item.amount,
            priceSubtitle: currencyFormat(
              Number(item.amount) + MegaConstants.BalanceFee,
            ),
            description: t('addFunds.receiveAmount', { amount: item.amount }),
          };
        },
      );

      settProductList(productSelectors);
      setSelectedFund(productSelectors[0]);
    }
  }, [fundsQuery.status, profileQuery.data]);

  useEffect(() => {
    if (autoRechargeQuery.status === 'success') {
      setAutoRechargeInfo(autoRechargeQuery.data);
    }
  }, [autoRechargeQuery.data]);

  const onChangeAutoRecargaSwitch = async (_: boolean) => {
    setIsAutoRechargeModalVisible(true);
  };

  const saveAutoRecharge = async (
    paymentMethodId: string,
    minBalance: number,
    reloadBalance: number,
  ) => {
    setIsAutoRechargeModalVisible(false);

    try {
      setLoading(true);

      const isSuccess = await AccountServices.updateAutoRecharge(
        paymentMethodId,
        minBalance,
        reloadBalance,
      );

      setLoading(false);

      if (isSuccess) {
        autoRechargeQuery.refetch();
      } else {
        showAutoRechargeError();
      }
    } catch (error) {
      setLoading(false);
      showAutoRechargeError();
    } finally {
      setLoading(false);
    }
  };

  const deleteAutoRecharge = async () => {
    setIsAutoRechargeModalVisible(false);

    try {
      setLoading(true, { title: t('deleting') });

      const isSuccess = await AccountServices.updateAutoRecharge('0', 0, 0);

      setLoading(false);

      if (isSuccess) {
        autoRechargeQuery.refetch();
      } else {
        showAutoRechargeError();
      }
    } catch (error) {
      setLoading(false);
      showAutoRechargeError();
    } finally {
      setLoading(false);
    }
  };

  const showAutoRechargeError = () => {
    showModal({
      type: 'error',
      title: t('error'),
      description: t('no_expected_error_try_again'),
      onClose: (id?: string | undefined) => {
        if (id === 'retry') {
          onChangeAutoRecargaSwitch(true);
        }
      },
      buttons: [
        {
          id: 'retry',
          title: t('retry'),
          onPress: () => {
            hideModal();
          },
          variant: 'secondary',
        },
      ],
    });
  };

  return (
    <>
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.darkGreen, '#6AA500']}
          start={[0, 0]}
          end={[0, 1]}
          style={styles.gradient}
        >
          <View
            style={{
              marginTop: 15,
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}
          >
            <MegaText
              size={30}
              styles={{
                lineHeight: 54,
                margin: 0,
                padding: 0,
                color: '#E3F4C9',
              }}
            >
              $
            </MegaText>
            <MegaText
              size={44}
              font={FontType.medium}
              styles={{
                lineHeight: 54,
                margin: 0,
                padding: 0,
                color: Colors.white,
              }}
            >
              53.10
            </MegaText>
          </View>
          <View style={{ marginTop: 0, marginBottom: 20 }}>
            <MegaText
              size={15}
              font={FontType.medium}
              styles={{ lineHeight: 19, color: '#E3F4C9' }}
            >
              {t('addFunds.currentBalance')}
            </MegaText>
          </View>
        </LinearGradient>
      </View>

      <ScreenWithKeyboard
        FooterComponent={
          <MegaButton
            text={t('addSaldo')}
            variant="secondary"
            onPress={() => {}}
            containerStyles={{ marginVertical: 15 }}
          />
        }
        useBottomSafeview
        keepFooterComponentAnchored
      >
        <View style={styles.autoRecargaContainer}>
          <View style={{ flexDirection: 'column', width: '85%' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ marginEnd: 5 }}>
                <SVGs.AutoRecarga width={25} height={25} />
              </View>
              <View>
                <MegaText
                  size={16}
                  styles={{ lineHeight: 24, color: Colors.primary }}
                  font={FontType.medium}
                >
                  {t('addFunds.autoRecarga')}
                </MegaText>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                paddingRight: 10,
              }}
            >
              <MegaText size={13} styles={{ lineHeight: 18, flexShrink: 1 }}>
                {t('addFunds.autoRecargaDesc')}
              </MegaText>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              width: '15%',
            }}
          >
            <Switch
              trackColor={{ false: '#767577', true: Colors.darkGreen }}
              thumbColor={
                hasAutoRechargeInfo(autoRechargeInfo) ? '#f4f3f4' : '#f4f3f4'
              }
              ios_backgroundColor="#3e3e3e"
              onValueChange={onChangeAutoRecargaSwitch}
              value={hasAutoRechargeInfo(autoRechargeInfo)}
            />
          </View>
        </View>
        <View style={{ marginTop: 25 }}>
          <MegaText
            styles={{
              textAlign: 'center',
              lineHeight: 21,
              color: Colors.primary,
            }}
            font={FontType.medium}
            size={18}
          >
            {t('addFunds.addFundsTitle')}
          </MegaText>
        </View>
        <View style={{ marginTop: 20 }}>
          <MegaText styles={{ textAlign: 'center', lineHeight: 20 }} size={15}>
            {t('addFunds.addFundsDesc', {
              fee: currencyFormat(MegaConstants.BalanceFee),
            })}
          </MegaText>
        </View>

        <FlatList
          nestedScrollEnabled
          scrollEnabled={false}
          data={productList}
          renderItem={(item) =>
            renderItem(item.item, selectedFund, setSelectedFund)
          }
          keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 20 }}
        />
      </ScreenWithKeyboard>

      {autoRechargeInfo && (
        <AutoRecargaModal
          isVisible={isAutoRechargeModalVisible}
          onCancel={() => {
            setIsAutoRechargeModalVisible(false);
          }}
          autoRechargeInfo={autoRechargeInfo}
          onSaved={saveAutoRecharge}
          onDelete={deleteAutoRecharge}
        />
      )}
    </>
  );
};

const renderItem = (
  item: MegaFundSelector,
  selectedFund: MegaFundSelector | null,
  setSelectedFund: (item: MegaFundSelector) => void,
) => {
  return (
    <TouchableWithoutFeedback onPress={() => setSelectedFund(item)}>
      <View
        style={[
          styles.rowContainer,
          selectedFund?.id === item.id && styles.rowContainerActive,
        ]}
      >
        <View>
          <MegaText
            size={21}
            font={FontType.bold}
            styles={{ color: Colors.primary, lineHeight: 24 }}
          >
            {item.priceTitle}
          </MegaText>
          <MegaText>{item.description}</MegaText>
        </View>
        <View>
          <View style={styles.buttonRowContainer}>
            <LinearGradient
              colors={['#E4F6C3', '#E1EEE7']}
              start={[0, 0]}
              end={[0, 1]}
              style={styles.buttonRowGradientContainer}
            >
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ color: Colors.primary }}
              >
                {item.priceSubtitle}
              </MegaText>
            </LinearGradient>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  buttonRowContainer: {
    borderRadius: 10,
    height: 40,
  },
  buttonRowGradientContainer: {
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginHorizontal: 2,

    shadowColor: '#030047',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    marginBottom: 20,

    borderWidth: 2,
    borderColor: 'transparent',
  },

  rowContainerActive: {
    borderWidth: 2,
    borderColor: Colors.darkGreen,
  },

  container: {
    marginTop: 0,
  },
  gradient: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flexDirection: 'column',
    backgroundColor: Colors.backgroundScreen,
    padding: 16,
  },
  autoRecargaContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 16,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
});
