import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { TopupCartItem } from '../../models';
import { Colors, themeStyles } from '../../themes';
import { currencyFormat } from '../../utils';
import { HtmlContent } from '../html-content';
import { Flag, FontType, MegaText } from '../ui';

export type TopupCartSingleProps = {
  item: TopupCartItem;
  onDelete: () => void;
};

export const TopupCartSingle = ({ item, onDelete }: TopupCartSingleProps) => {
  const { t } = useTranslation();
  const { contact, carrierRate, carrier, country, futurePromotionalDate } =
    item;

  return (
    <View
      style={[
        styles.container,
        carrierRate.future &&
          carrierRate.future.enabled &&
          styles.containerWithFuture,
      ]}
    >
      <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
        <View style={{ flexDirection: 'column', flexGrow: 1 }}>
          <View style={{ flexDirection: 'row', marginBottom: 3 }}>
            {!contact.isMegaconecta && (
              <View>
                <Flag
                  name={country.value}
                  styles={{ width: 20, height: 20, marginRight: 5 }}
                />
              </View>
            )}
            <MegaText
              size={16}
              font={FontType.medium}
              styles={{ lineHeight: 21, color: Colors.primary }}
            >
              {contact.isMegaconecta
                ? contact.fullName
                : contact.formattedPhone}
            </MegaText>
          </View>

          {contact.isMegaconecta && (
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <View>
                <Flag name={country.value} styles={{ width: 20, height: 20 }} />
              </View>
              <View>
                <MegaText size={13} styles={{ color: '#616161' }}>
                  {contact.formattedPhone}
                </MegaText>
              </View>
            </View>
          )}

          <View style={{ flexDirection: 'row', marginBottom: 3 }}>
            <View>
              <MegaText
                size={13}
                styles={{ lineHeight: 18, color: '#616161', marginRight: 5 }}
              >
                {carrier.label}
              </MegaText>
            </View>
            <View>
              <SVGs.CarrierTransIcon />
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'column' }}>
          <View>
            <MegaText
              size={16}
              font={FontType.medium}
              styles={{ lineHeight: 20, color: Colors.primary }}
            >
              {currencyFormat(Number(carrierRate.realAmount))}
            </MegaText>
          </View>
          <View style={{ alignItems: 'flex-end', marginTop: 3 }}>
            <Pressable onPress={onDelete}>
              <SVGs.DeleteContactIcon width={20} height={20} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 5, marginHorizontal: 10 }}>
        <HtmlContent content={carrierRate.remoteFormattedAmount} />
      </View>

      {carrierRate.future && carrierRate.future.enabled && (
        <View style={styles.futureContainer}>
          <View
            style={{
              justifyContent: 'center',
              marginRight: 5,
            }}
          >
            <SVGs.Account.Servicios.Promos />
          </View>
          <View>
            <View>
              <MegaText size={13} font={FontType.medium}>
                {t('future.topupInPromo')}
              </MegaText>
            </View>
            <View>
              <MegaText size={13}>
                {t('future.topupEffectiveFuture') +
                  ' ' +
                  carrierRate.future.date}
              </MegaText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 20,
    backgroundColor: Colors.white,
    paddingVertical: 10,
    borderRadius: 12,
    ...themeStyles.shadow,
  },
  containerWithFuture: {
    paddingBottom: 0,
  },
  futureContainer: {
    marginTop: 5,
    flexDirection: 'row',
    backgroundColor: '#FFEDB9',
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
