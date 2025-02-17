import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useQuery } from 'react-query';
import { LottieResources } from '../../assets/animations';
import { SVGs } from '../../assets/svg';
import { PaymentMethodCard, QueryTypes } from '../../models';
import { useLoadingContext } from '../../providers';
import { PaymentServices } from '../../services';
import { Colors, themeStyles } from '../../themes';
import { ReportPaymentIcon } from '../reports';
import { FontType, MegaButton, MegaGradient, MegaText } from '../ui';
import { AddPaymentMethodModal } from './add-payment-method-modal';

export const ManagePaymentMethods = () => {
  const { t } = useTranslation();
  const { isLoading, setLoading } = useLoadingContext();
  const { navigate } = useNavigation();

  const [paymentMethodList, setPaymentMethodList] = useState<
    PaymentMethodCard[]
  >([]);

  const paymentMethodsQuery = useQuery(
    QueryTypes.GetPaymentMethods,
    () => {
      setLoading(true);
      return PaymentServices.getPaymentMethods();
    },
    {
      onSettled: () => {
        setLoading(false);
      },
    },
  );

  useEffect(() => {
    if (paymentMethodsQuery.status === 'success') {
      setPaymentMethodList(paymentMethodsQuery.data);
    }
  }, [paymentMethodsQuery.data]);

  const addPaymentMethod = () => {
    navigate('CreditCardFormRoute', { existingCard: undefined });
  };

  const addPaymentMethodFooter = () => {
    if (isLoading || paymentMethodList.length === 0) {
      return null;
    }

    return (
      <TouchableWithoutFeedback onPress={addPaymentMethod}>
        <View style={styles.rowContainer}>
          <View>
            <SVGs.Payment.AddCircleIcon fill={Colors.darkGreen} />
          </View>
          <View style={{ flexGrow: 1, paddingLeft: 10 }}>
            <MegaText
              size={16}
              font={FontType.medium}
              styles={{ lineHeight: 24, color: Colors.darkGreen }}
            >
              {t('paymentMethodsSection.addMethod')}
            </MegaText>
          </View>
          <View>
            <SVGs.ArrowListItem fill={Colors.darkGreen} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const emptyPaymentMethodList = () => (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LottieView
        autoPlay
        style={{
          width: 140,
          height: 140,
        }}
        source={LottieResources.noPaymentMethod}
      />
      <MegaText
        size={16}
        font={FontType.medium}
        styles={{
          lineHeight: 21,
          color: '#5F6368',
          textAlign: 'center',
        }}
      >
        {t('paymentMethodsSection.noPaymentMethods')}
      </MegaText>
      <MegaText
        size={13}
        styles={{
          lineHeight: 18,
          color: '#949494',
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        {t('paymentMethodsSection.noPaymentMethodsDescription')}
      </MegaText>
      <MegaButton
        variant="link"
        text={t('paymentMethodsSection.addMethod')}
        onPress={addPaymentMethod}
        iconLeft={<SVGs.Payment.AddCircleIcon fill={Colors.darkGreen} />}
      />
    </View>
  );

  return (
    <>
      <FlatList
        nestedScrollEnabled
        data={paymentMethodList}
        keyExtractor={(item) => item.id}
        renderItem={(item) => renderItem(item.item)}
        ListFooterComponent={addPaymentMethodFooter}
        ListEmptyComponent={isLoading ? null : emptyPaymentMethodList()}
        contentContainerStyle={{
          flex: 1,
          flexGrow: 1,
        }}
      />
      <AddPaymentMethodModal isVisible={false} onClose={() => {}} />
    </>
  );
};

const renderItem = (item: PaymentMethodCard) => (
  <View style={[styles.rowContainer]}>
    <View>
      <MegaGradient
        styles={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          width: 50,
          height: 50,
        }}
      >
        <ReportPaymentIcon
          paymentMethod={item.payment_type}
          width={30}
          height={30}
        />
      </MegaGradient>
    </View>
    <View style={styles.ccNameContainer}>
      {item.payment_type.toLowerCase() === 'paypal' ? (
        <MegaText
          size={16}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: Colors.primary }}
        >
          PayPal
        </MegaText>
      ) : (
        <>
          <MegaText
            size={16}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
            nativeProps={{
              numberOfLines: 3,
              ellipsizeMode: 'tail',
            }}
          >
            {`${item.first_name} ${item.last_name}`}
          </MegaText>
          <MegaText size={13} styles={{ lineHeight: 20 }}>
            {item.title.replaceAll('·', 'X')}
          </MegaText>
        </>
      )}
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity activeOpacity={0.5}>
        <View style={styles.button}>
          <SVGs.GrayEditIcon />
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.5}>
        <View style={styles.button}>
          <SVGs.DeleteContactIcon />
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  ccNameContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexGrow: 1,
    paddingLeft: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 10,
    marginHorizontal: 2,
    marginBottom: 20,

    ...themeStyles.shadow,
    maxHeight: 70,
  },
  button: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    width: 40,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
});
