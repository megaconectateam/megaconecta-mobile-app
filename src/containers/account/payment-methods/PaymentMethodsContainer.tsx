import { View } from 'react-native';
import { ManagePaymentMethods } from '../../../components';

export const PaymentMethodsContainer = () => {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16, flex: 1 }}>
      <ManagePaymentMethods />
    </View>
  );
};
