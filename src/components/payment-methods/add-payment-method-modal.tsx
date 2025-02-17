import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { Colors, themeStyles } from '../../themes';
import { FontType, MegaGradient, MegaModal, MegaText } from '../ui';

export type AddPaymentMethodModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const AddPaymentMethodModal = ({
  isVisible,
  onClose,
}: AddPaymentMethodModalProps) => {
  const { t } = useTranslation();

  return (
    <MegaModal
      isLoading={false}
      modalProps={{
        isVisible,
        avoidKeyboard: true,
        scrollHorizontal: false,
      }}
      modalStyle={styles.view}
    >
      <View style={styles.content}>
        <View
          style={{
            alignItems: 'center',
            position: 'relative',
            marginBottom: 30,
          }}
        >
          <View
            style={{
              paddingHorizontal: 30,
            }}
          >
            <MegaText
              size={18}
              font={FontType.medium}
              styles={{
                lineHeight: 21,
                color: Colors.primary,
                textAlign: 'center',
              }}
            >
              {t('paymentMethodsSection.addMethod')}
            </MegaText>
          </View>

          <View style={{ position: 'absolute', top: 4, right: 0 }}>
            <TouchableOpacity onPress={() => onClose()}>
              <SVGs.CloseIcon />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{ marginBottom: 20 }}
          onPress={() => onClose()}
        >
          <View style={styles.header}>
            <View style={{ paddingRight: 10 }}>
              <MegaGradient
                icon={<SVGs.Payment.CreditCardIcon width={30} height={30} />}
              />
            </View>
            <View style={{ flexGrow: 1 }}>
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ color: Colors.primary, lineHeight: 24 }}
              >
                {t('paymentMethodsSection.creditDebitCard')}
              </MegaText>
            </View>
            <View style={{ paddingLeft: 10 }}>
              <SVGs.ArrowListItem width={15} fill={Colors.borderInput} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{ marginBottom: 20 }}
          onPress={() => onClose()}
        >
          <View style={styles.header}>
            <View style={{ paddingRight: 10 }}>
              <MegaGradient
                icon={<SVGs.Payment.PaypalIcon width={30} height={30} />}
              />
            </View>
            <View style={{ flexGrow: 1 }}>
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ color: Colors.primary, lineHeight: 24 }}
              >
                PayPal
              </MegaText>
            </View>
            <View style={{ paddingLeft: 10 }}>
              <SVGs.ArrowListItem width={15} fill={Colors.borderInput} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </MegaModal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.white,
    ...themeStyles.shadow,
  },
});
