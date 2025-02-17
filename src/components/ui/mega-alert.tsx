import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { LottieResources } from '../../assets/animations';
import { SVGs } from '../../assets/svg';
import { Colors } from '../../themes';
import { ButtonVariant, MegaButton } from './mega-button';
import { FontType, MegaText } from './mega-text';

export type MegaAlertType =
  | 'success'
  | 'error'
  | 'credit-card'
  | 'delete'
  | 'success-password-change'
  | 'none';

export type MegaAlertButton = {
  id: string;
  title: string;
  onPress: () => void;
  variant: ButtonVariant;
};

export type MegaAlertProps = {
  isVisible: boolean;
  type: MegaAlertType;
  onClose: (id?: string | undefined) => void;

  title?: string;
  description?: string;
  showLoading?: boolean;
  isModal?: boolean;

  buttons?: MegaAlertButton[];
};

export const MegaAlert = (props: MegaAlertProps) => {
  const [urlAnimation, setUrlAnimation] = useState(null);
  const [lastPressedBtn, setLastPressedBtn] = useState<string>('');

  useEffect(() => {
    switch (props.type) {
      case 'success':
        setUrlAnimation(LottieResources.completeSuccess);
        break;

      case 'error':
        setUrlAnimation(LottieResources.error);
        break;

      case 'credit-card':
        setUrlAnimation(LottieResources.creditCard);
        break;

      case 'delete':
        setUrlAnimation(LottieResources.delete);
        break;

      case 'success-password-change':
        setUrlAnimation(LottieResources.padlock);
        break;

      default:
        setUrlAnimation(null);
        break;
    }
  }, [props.type]);

  return (
    <Modal
      isVisible={props.isVisible}
      swipeDirection={!props.isModal ? ['down'] : []}
      scrollHorizontal={!props.isModal}
      style={styles.view}
      onModalHide={() => props.onClose(lastPressedBtn)}
    >
      <View style={styles.content}>
        {!props.isModal && (
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
              <TouchableOpacity onPress={() => props.onClose()}>
                <SVGs.CloseIcon />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.animationContainer}>
          {!!urlAnimation && props.type !== 'none' && (
            <LottieView
              autoPlay
              style={{
                width: 100,
                height: 100,
              }}
              source={urlAnimation}
            />
          )}
        </View>

        {props.title && (
          <MegaText
            size={20}
            font={FontType.medium}
            styles={{
              lineHeight: 21,
              color: Colors.primary,
              textAlign: 'center',
              marginVertical: 20,
            }}
          >
            {props.title}
          </MegaText>
        )}

        {props.description && (
          <MegaText
            size={15}
            styles={{ lineHeight: 21, textAlign: 'center', marginBottom: 20 }}
          >
            {props.description}
          </MegaText>
        )}

        {props.showLoading && (
          <View style={styles.animationContainer}>
            <LottieView
              autoPlay
              style={{
                width: 70,
                height: 70,
              }}
              source={require('../../assets/animations/loading.json')}
            />
          </View>
        )}

        {props.buttons &&
          props.buttons.map((button, index) => (
            <View
              style={{ paddingHorizontal: 20, marginVertical: 10 }}
              key={index}
            >
              <MegaButton
                variant={button.variant}
                text={button.title}
                onPress={() => {
                  setLastPressedBtn(button.id);
                  button.onPress();
                }}
              />
            </View>
          ))}

        {props.type === 'delete' && (
          <View
            style={{ flexDirection: 'row', width: '100%', marginVertical: 10 }}
          >
            <View style={{ width: '48%', marginRight: '4%' }}>
              <MegaButton
                variant="light-danger"
                text="Cancelar"
                onPress={() => {
                  setLastPressedBtn('cancelar');
                  props.onClose(lastPressedBtn);
                }}
              />
            </View>
            <View style={{ width: '48%' }}>
              <MegaButton
                variant="danger"
                text="Eliminar"
                onPress={() => {
                  setLastPressedBtn('delete');
                  props.onClose(lastPressedBtn);
                }}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  animationContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});
