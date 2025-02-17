import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { useTopup } from '../../providers';
import { Colors } from '../../themes';
import { FontType, MegaModal, MegaText } from '../ui';

export type ModalFutureProps = {
  isVisible: boolean;
  onClose: (isFuture: boolean, isCancel: boolean) => void;
};

export const ModalFuture = ({ isVisible, onClose }: ModalFutureProps) => {
  const { t } = useTranslation();
  const { initialData } = useTopup();

  return (
    <MegaModal
      isLoading={false}
      modalProps={{
        isVisible,
        scrollHorizontal: false,
        avoidKeyboard: true,
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
              {t('topupSection.futureTitle')}
            </MegaText>
          </View>

          <View style={{ position: 'absolute', top: 4, right: 0 }}>
            <TouchableOpacity onPress={() => onClose(false, true)}>
              <SVGs.CloseIcon />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{ marginBottom: 20 }}
          onPress={() => onClose(true, false)}
        >
          <LinearGradient
            colors={['#E4F6C3', '#E1EEE7']}
            start={[0, 0]}
            end={[0, 1]}
            style={styles.header}
          >
            <View style={{ paddingRight: 10 }}>
              <SVGs.Account.Servicios.Promos width={30} height={30} />
            </View>
            <View style={{ flexGrow: 1, flexDirection: 'column' }}>
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ color: Colors.primary, lineHeight: 24 }}
              >
                {t('future.topupInPromo')}
              </MegaText>
              <MegaText
                size={13}
                styles={{ color: Colors.primary, lineHeight: 18 }}
              >
                {t('future.topupEffectiveFuture')}
              </MegaText>
              <MegaText
                size={13}
                font={FontType.semiBold}
                styles={{ color: Colors.primary, lineHeight: 18 }}
              >
                {initialData?.future_date}
              </MegaText>
            </View>
            <View style={{ paddingLeft: 10 }}>
              <SVGs.ArrowListItem width={15} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{ marginBottom: 20 }}
          onPress={() => onClose(false, false)}
        >
          <LinearGradient
            colors={['#E4F6C3', '#E1EEE7']}
            start={[0, 0]}
            end={[0, 1]}
            style={styles.header}
          >
            <View style={{ paddingRight: 10 }}>
              <SVGs.TopupNowIcon width={30} height={30} />
            </View>
            <View style={{ flexGrow: 1, flexDirection: 'column' }}>
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ color: Colors.primary, lineHeight: 24 }}
              >
                {t('future.topupNow')}
              </MegaText>
              <MegaText
                size={13}
                styles={{ color: Colors.primary, lineHeight: 18 }}
              >
                {t('future.topupEffectiveNow')}
              </MegaText>
              <MegaText
                size={13}
                font={FontType.semiBold}
                styles={{ color: Colors.primary, lineHeight: 18 }}
              >
                {t('future.topupEffectiveNow2')}
              </MegaText>
            </View>
            <View style={{ paddingLeft: 10 }}>
              <SVGs.ArrowListItem width={15} />
            </View>
          </LinearGradient>
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
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  header: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
});
