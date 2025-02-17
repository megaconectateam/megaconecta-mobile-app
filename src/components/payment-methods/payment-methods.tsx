import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useQuery } from 'react-query';
import { SVGs } from '../../assets/svg';
import {
  NewCardInformation,
  NewPaypalInformation,
  PaymentMethodCard,
  QueryTypes,
} from '../../models';
import { PaymentServices } from '../../services';
import { Colors } from '../../themes';
import { FontType, MegaRadio, MegaText } from '../ui';

export type PaymentMethodsProps = {
  displayManageCards?: boolean;
  defaultSelectedPaymentMethodId?: string | null;

  onPaymentMethodChange: (
    method: PaymentMethodCard | NewCardInformation | NewPaypalInformation,
  ) => void;
};

export const PaymentMethods = (props: PaymentMethodsProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethodCard | NewCardInformation | NewPaypalInformation | undefined
  >(undefined);
  const [paymentMethodType, setPaymentMethodType] = useState<
    'card' | 'paypal' | 'new-card' | 'new-paypal' | undefined
  >(undefined);
  const [paymentMethodList, setPaymentMethodList] = useState<
    PaymentMethodCard[]
  >([]);

  const paymentMethodsQuery = useQuery(
    QueryTypes.GetPaymentMethods,
    PaymentServices.getPaymentMethods,
  );

  useEffect(() => {
    if (!selectedPaymentMethod) {
      return;
    }

    props.onPaymentMethodChange(selectedPaymentMethod);
  }, [selectedPaymentMethod]);

  useEffect(() => {
    if (paymentMethodsQuery.status === 'success') {
      const pmList = paymentMethodsQuery.data;

      if (!pmList || !pmList.length) {
        return;
      }

      let defaultValue = pmList[0];
      if (props.defaultSelectedPaymentMethodId) {
        const item = pmList.find(
          (pm) => pm.id === props.defaultSelectedPaymentMethodId,
        );

        if (item) {
          defaultValue = item;
        }
      }

      setSelectedPaymentMethod(defaultValue);
      setPaymentMethodType(
        pmList[0].payment_type.toLowerCase() === 'paypal' ? 'paypal' : 'card',
      );
      setPaymentMethodList(pmList);
    }
  }, [paymentMethodsQuery.data]);

  const onPaymentMethodChange = (id: string) => {
    const item = paymentMethodList.find((pm) => pm.id === id);

    if (!item) {
      return;
    }

    setSelectedPaymentMethod(item);
  };

  const addPaymentMethod = () => {};

  return (
    <View>
      <View style={styles.titleContainer}>
        <View style={{ flexGrow: 1 }}>
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{ lineHeight: 21, color: Colors.primary }}
          >
            Pagar con
          </MegaText>
        </View>
        <View style={{ marginRight: 5 }}>
          {props.displayManageCards && <SVGs.Payment.EditPencilIcon />}
        </View>
        <View>
          {props.displayManageCards && (
            <TouchableOpacity>
              <MegaText
                size={16}
                font={FontType.bold}
                styles={{ lineHeight: 24, color: Colors.darkGreen }}
              >
                Administrar tarjetas
              </MegaText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        nestedScrollEnabled
        scrollEnabled={false}
        data={paymentMethodList}
        keyExtractor={(item) => item.id}
        renderItem={(item) =>
          renderItem(
            item.item,
            selectedPaymentMethod?.id || '',
            onPaymentMethodChange,
          )
        }
        ListFooterComponent={() =>
          props.displayManageCards
            ? addPaymentMethodFooter(addPaymentMethod)
            : undefined
        }
      />
    </View>
  );
};

const addPaymentMethodFooter = (addPaymentMethod: () => void) => (
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
          Agregar método de pago
        </MegaText>
      </View>
      <View>
        <SVGs.ArrowListItem fill={Colors.darkGreen} />
      </View>
    </View>
  </TouchableWithoutFeedback>
);

const renderItem = (
  item: PaymentMethodCard,
  selectedPaymentMethodId: string,
  setSelectedPaymentMethodId: (id: string) => void,
) => (
  <TouchableWithoutFeedback onPress={() => setSelectedPaymentMethodId(item.id)}>
    <View
      style={[
        styles.rowContainer,
        item.id === selectedPaymentMethodId && styles.rowSelected,
      ]}
    >
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={['#E4F6C3', '#E1EEE7']}
          start={[0, 0]}
          end={[0, 1]}
          style={styles.iconGradient}
        >
          {item.payment_type.toLowerCase() === 'paypal' ? (
            <SVGs.Payment.PaypalIcon />
          ) : (
            <SVGs.Payment.MasterCardIcon />
          )}
        </LinearGradient>
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
            >
              {item.first_name}
            </MegaText>
            <MegaText>{item.title}</MegaText>
          </>
        )}
      </View>
      <View>
        <MegaRadio
          options={[{ id: item.id, value: '' }]}
          selectedId={selectedPaymentMethodId}
          onPress={setSelectedPaymentMethodId}
        />
      </View>
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  ccNameContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexGrow: 1,
    paddingLeft: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 15,
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
  },
  rowSelected: {
    borderColor: Colors.darkGreen,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 10,

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
