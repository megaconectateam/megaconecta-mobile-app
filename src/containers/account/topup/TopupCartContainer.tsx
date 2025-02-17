import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TopupCartSingle } from '../../../components';
import { MegaButton, ScreenWithKeyboard } from '../../../components/ui';
import { TopupCartItem } from '../../../models';
import { useTopup } from '../../../providers';
import { currencyFormat } from '../../../utils';

export const TopupCartContainer = () => {
  const { t } = useTranslation();
  const { cartItems, cartTotal, deleteCartItem } = useTopup();

  const bottomButtons = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
        }}
      >
        <View style={{ flexGrow: 1 }}>
          <MegaButton
            text={`${t('payNow')} (${currencyFormat(cartTotal)})`}
            variant="secondary"
            onPress={() => {}}
            disabled={cartItems.length === 0}
          />
        </View>
      </View>
    );
  };

  const deleteItem = (item: TopupCartItem) => {
    deleteCartItem(item);
  };

  return (
    <ScreenWithKeyboard
      FooterComponent={bottomButtons()}
      keepFooterComponentAnchored
      footerWithTopBorder
    >
      {cartItems.map((item) => (
        <TopupCartSingle
          key={item.uuid}
          item={item}
          onDelete={() => {
            deleteItem(item);
          }}
        />
      ))}
    </ScreenWithKeyboard>
  );
};
