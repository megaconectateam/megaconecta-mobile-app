import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { SVGs } from '../../assets/svg';
import { Colors } from '../../themes';
import { FontType, MegaButton, MegaText } from '../ui';

export type ContactPermissionsProps = {
  isVisible: boolean;
  onTapAction: (allowAccess?: boolean) => void;
  onModalHide?: () => void;
};

export const ContactPermissions = (props: ContactPermissionsProps) => {
  const { t } = useTranslation();

  const bullets = [
    t('contactSection.permission1'),
    t('contactSection.permission2'),
    t('contactSection.permission3'),
  ];

  return (
    <Modal
      isVisible={props.isVisible}
      swipeDirection={['down']}
      scrollHorizontal
      style={styles.view}
      onSwipeComplete={() => props.onTapAction(false)}
      onModalHide={props.onModalHide}
    >
      <View style={styles.content}>
        <View style={{ alignItems: 'center', position: 'relative' }}>
          <View
            style={{
              height: 5,
              width: 50,
              backgroundColor: Colors.border1,
              borderRadius: 5,
            }}
          />
          <View style={{ position: 'absolute', top: -8, right: 0 }}>
            <TouchableOpacity onPress={() => props.onTapAction(false)}>
              <SVGs.CloseIcon />
            </TouchableOpacity>
          </View>
        </View>

        <MegaText
          size={18}
          font={FontType.medium}
          styles={{
            lineHeight: 22,
            color: Colors.primary,
            textAlign: 'center',
            marginVertical: 20,
          }}
        >
          Permitir que Megaconecta acceda a tus contactos
        </MegaText>

        {bullets.map((per, index) => (
          <View style={styles.bulletContainer} key={index}>
            <View style={{ marginRight: 16, paddingTop: 5 }}>
              <SVGs.CircleGreenCheckIcon />
            </View>
            <View style={{ paddingRight: 16 }}>
              <MegaText
                size={15}
                styles={{ lineHeight: 22, color: Colors.primary }}
              >
                {per}
              </MegaText>
            </View>
          </View>
        ))}

        <View style={{ marginTop: 10 }}>
          <MegaText size={13} styles={{ lineHeight: 18 }}>
            Puedes administrar este acceso en cualquier momento en configuración
            de permisos
          </MegaText>
        </View>

        <View style={{ flexDirection: 'row', marginVertical: 20 }}>
          <View style={{ width: '48%', marginRight: '4%' }}>
            <MegaButton
              variant="light-secondary"
              onPress={() => {
                props.onTapAction(false);
              }}
              text="Ahora no"
            />
          </View>
          <View style={{ width: '48%' }}>
            <MegaButton
              variant="secondary"
              onPress={() => {
                props.onTapAction(true);
              }}
              text="Permitir acceso"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 20,
    backgroundColor: 'white',
    paddingHorizontal: 30,
  },
});
