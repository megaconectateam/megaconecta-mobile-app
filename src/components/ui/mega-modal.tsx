import { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import { MegaLoading } from './mega-loading';

export type MegaModalProps = {
  modalProps: Partial<ModalProps>;
  isLoading: boolean;
  loadingTitle?: string;
  modalStyle?: StyleProp<ViewStyle>;
};

export const MegaModal = (props: PropsWithChildren<MegaModalProps>) => {
  return (
    <Modal {...props.modalProps} style={props.modalStyle}>
      {props.isLoading && <MegaLoading title={props.loadingTitle} />}
      {props.children}
    </Modal>
  );
};
