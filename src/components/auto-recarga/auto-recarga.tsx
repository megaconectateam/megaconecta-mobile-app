import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { SVGs } from '../../assets/svg';
import { AutoRechargeFund, PaymentMethodCard } from '../../models';
import { Colors } from '../../themes';
import {
  MegaConstants,
  currencyFormat,
  hasAutoRechargeInfo,
} from '../../utils';
import { PaymentMethods } from '../payment-methods';
import { FontType, MegaButton, MegaSlider, MegaText } from '../ui';

export type AutoRecargaModalProps = {
  isVisible: boolean;
  autoRechargeInfo: AutoRechargeFund;
  onCancel: () => void;
  onDelete: () => void;
  onSaved: (id: string, minBalance: number, reloadBalance: number) => void;
};

const DEFAULT_MIN_BALANCE = 1;
const DEFAULT_MIN_RELOAD = 5;

export const AutoRecargaModal = (props: AutoRecargaModalProps) => {
  const { t } = useTranslation();

  const [minBalance, setMinBalance] = useState(DEFAULT_MIN_BALANCE);
  const [reloadBalance, setReloadBalance] = useState(DEFAULT_MIN_RELOAD);
  const [switchState, setSwitchState] = useState(false);
  const [switchStateManual, setSwitchStateManual] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodCard>();

  const [scrollOffset, setScrollOffset] = useState();

  useEffect(() => {
    if (hasAutoRechargeInfo(props.autoRechargeInfo) && props.isVisible) {
      setMinBalance(Number(props.autoRechargeInfo.trigger));
      setReloadBalance(Number(props.autoRechargeInfo.amount));

      if (!switchStateManual) {
        setSwitchState(hasAutoRechargeInfo(props.autoRechargeInfo));
      }
    }
  }, [props.autoRechargeInfo, props.isVisible]);

  const deleteAutoRecharge = async () => {
    props.onDelete();
  };

  const onChangeAutoRecargaSwitch = async (checked: boolean) => {
    if (!checked) {
      setSwitchState(false);
      setSwitchStateManual(false);
    } else {
      setMinBalance(DEFAULT_MIN_BALANCE);
      setReloadBalance(DEFAULT_MIN_RELOAD);

      setSwitchState(true);
      setSwitchStateManual(true);
    }
  };

  const onSubmit = async () => {
    if (!selectedPaymentMethod) {
      return;
    }

    // if the switch is off, then let's delete the auto-recharge
    if (!switchState) {
      return deleteAutoRecharge();
    }

    props.onSaved(selectedPaymentMethod.id, minBalance, reloadBalance);
  };

  const scrollViewRef = useRef<ScrollView>();

  const handleScrollTo = (p: any) => {
    if (scrollViewRef && scrollViewRef?.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const handleOnScroll = (e: any) => {
    setScrollOffset(e.nativeEvent.contentOffset.y);
  };

  return (
    <>
      <Modal
        isVisible={props.isVisible}
        scrollHorizontal={false}
        style={styles.modal}
        scrollOffsetMax={700 - 600}
        scrollOffset={scrollOffset}
        scrollTo={handleScrollTo}
        propagateSwipe
      >
        <View style={styles.modalContainer}>
          <View>
            <MegaText
              size={18}
              font={FontType.medium}
              styles={{
                lineHeight: 21,
                textAlign: 'center',
                paddingVertical: 15,
                color: Colors.primary,
              }}
            >
              {t('addFunds.autoRecarga')}
            </MegaText>

            <TouchableOpacity
              onPress={props.onCancel}
              style={{ position: 'absolute', right: 4, top: 18 }}
            >
              <SVGs.CloseIcon />
            </TouchableOpacity>
          </View>

          <View>
            <MegaText>{t('autoRecarga.description')}</MegaText>
          </View>

          {/*
          // @ts-ignore */}
          <ScrollView ref={scrollViewRef} onScroll={handleOnScroll}>
            <View style={styles.switchContainer}>
              <View style={{ flexGrow: 1 }}>
                <MegaText
                  size={16}
                  styles={{ lineHeight: 24, color: Colors.darkGreen }}
                >
                  {t('autoRecarga.active')}
                </MegaText>
              </View>

              <View>
                <Switch
                  trackColor={{ false: '#767577', true: Colors.darkGreen }}
                  thumbColor={switchState ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={onChangeAutoRecargaSwitch}
                  value={switchState}
                />
              </View>
            </View>

            {switchState && (
              <>
                <View style={styles.priceContainer}>
                  <View style={{ flexGrow: 1 }}>
                    <MegaText
                      size={18}
                      font={FontType.medium}
                      styles={{ lineHeight: 21, color: Colors.primary }}
                    >
                      {t('autoRecarga.minBalance')}
                    </MegaText>
                  </View>
                  <View>
                    <MegaText
                      size={16}
                      font={FontType.medium}
                      styles={{ lineHeight: 24, color: Colors.primary }}
                    >
                      {currencyFormat(minBalance)}
                    </MegaText>
                  </View>
                </View>

                <View style={{ paddingHorizontal: 15 }}>
                  <MegaSlider
                    value={minBalance}
                    minValue={1}
                    maxValue={100}
                    onValueChange={setMinBalance}
                  />
                </View>

                <View style={styles.priceContainer}>
                  <View style={{ flexGrow: 1 }}>
                    <MegaText
                      size={18}
                      font={FontType.medium}
                      styles={{ lineHeight: 21, color: Colors.primary }}
                    >
                      {t('autoRecarga.amountToRecharge')}
                    </MegaText>
                  </View>
                  <View>
                    <MegaText
                      size={16}
                      font={FontType.medium}
                      styles={{ lineHeight: 24, color: Colors.primary }}
                    >
                      {currencyFormat(reloadBalance)}
                    </MegaText>
                  </View>
                </View>

                <View style={{ paddingHorizontal: 15 }}>
                  <MegaSlider
                    value={reloadBalance}
                    minValue={5}
                    maxValue={25}
                    onValueChange={setReloadBalance}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <View style={{ flexGrow: 1 }}>
                    <MegaText
                      size={16}
                      font={FontType.medium}
                      styles={{ color: Colors.primary, lineHeight: 21 }}
                    >
                      {t('totalPay')}
                    </MegaText>
                  </View>
                  <View>
                    <MegaText
                      size={16}
                      font={FontType.medium}
                      styles={{ color: Colors.primary, lineHeight: 21 }}
                    >
                      {currencyFormat(reloadBalance + MegaConstants.BalanceFee)}
                    </MegaText>
                  </View>
                </View>

                <PaymentMethods
                  defaultSelectedPaymentMethodId={
                    props.autoRechargeInfo?.payment_method_id
                  }
                  onPaymentMethodChange={(method) => {
                    setSelectedPaymentMethod(method as PaymentMethodCard);
                  }}
                />
              </>
            )}
          </ScrollView>

          <View
            style={{
              overflow: 'hidden',
              paddingTop: 5,
              backgroundColor: Colors.white,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                paddingVertical: 10,
                paddingHorizontal: 16,
                flexDirection: 'row',

                shadowColor: '#030047',
                shadowOffset: {
                  width: 0,
                  height: -3,
                },
                shadowOpacity: 0.07,
                shadowRadius: 2,
                elevation: 4,
              }}
            >
              <View style={{ width: '48%', marginRight: '4%' }}>
                <MegaButton
                  text={t('cancel')}
                  onPress={props.onCancel}
                  variant="light-secondary"
                />
              </View>
              <View style={{ width: '48%' }}>
                <MegaButton
                  text={t('save')}
                  onPress={() => {
                    onSubmit();
                  }}
                  variant="secondary"
                />
              </View>
            </View>
          </View>
          <SafeAreaView style={{ minHeight: 16 }} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    zIndex: 1000,
    backgroundColor: '#f9f9f9',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    paddingHorizontal: 16,
    maxHeight: '90%',
  },
  titleContainer: {
    position: 'relative',
  },
  switchContainer: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    shadowColor: '#030047',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    marginHorizontal: 2,
    padding: Platform.select({
      ios: 20,
      android: 12,
    }),
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
});
