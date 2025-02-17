import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { MegaCarrierRate } from '../../models';
import { Colors, themeStyles } from '../../themes';
import { currencyFormat } from '../../utils';
import { HtmlContent } from '../html-content';
import { FontType, MegaText } from '../ui';

export type TopupProductProps = {
  product: MegaCarrierRate;
  isSelected: boolean;
  onSelectProduct: (product: MegaCarrierRate) => void;
  onLayout?: (y: number) => void;
};

export const TopupProduct = ({
  product,
  isSelected,
  onSelectProduct,
  onLayout,
}: TopupProductProps) => {
  const { t } = useTranslation();

  return (
    <TouchableWithoutFeedback onPress={() => onSelectProduct(product)}>
      <View
        style={[
          styles.container,
          isSelected && styles.active,
          product.future &&
            product.future.enabled &&
            styles.containerWithFuture,
        ]}
        onLayout={(event) => {
          const y = event.nativeEvent.layout.y;
          onLayout && onLayout(y);
        }}
      >
        <LinearGradient
          colors={['#E4F6C3', '#E1EEE7']}
          start={[0, 0]}
          end={[0, 1]}
          style={styles.header}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              flexGrow: 1,
            }}
          >
            <MegaText
              size={21}
              font={FontType.bold}
              styles={{ color: Colors.primary }}
            >
              {(product.remoteAmount || '').replace('.00', '')}{' '}
            </MegaText>
            <MegaText
              size={21}
              font={FontType.bold}
              styles={{ color: Colors.darkGreen }}
            >
              {product.remoteCurrency}
            </MegaText>
          </View>
          <View style={styles.headerButton}>
            <MegaText
              size={16}
              font={FontType.medium}
              styles={{
                color: Colors.white,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              {currencyFormat(Number(product.realAmount))}
            </MegaText>
          </View>
        </LinearGradient>
        <View style={styles.content}>
          <HtmlContent content={product.remoteFormattedAmount} />
        </View>
        {product.future && product.future.enabled && (
          <View style={styles.futureContainer}>
            <MegaText
              size={13}
              styles={{ lineHeight: 18, color: '#5F6368', textAlign: 'center' }}
            >
              {t('future.topupEffectiveFuture')} {product.future.date}
            </MegaText>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.white,
    borderRadius: 12,
    ...themeStyles.shadow,
    // padding: 5,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  active: {
    borderWidth: 2,
    borderColor: Colors.darkGreen,
  },
  header: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 58,
    paddingLeft: 10,
    margin: 5,
  },
  headerButton: {
    marginRight: 10,
    backgroundColor: Colors.darkGreen,
    color: Colors.white,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  content: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  containerWithFuture: {
    paddingBottom: 0,
  },
  futureContainer: {
    backgroundColor: '#FFEDB9',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 5,
  },
});
