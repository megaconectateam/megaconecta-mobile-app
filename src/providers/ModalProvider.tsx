import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { MegaAlert, MegaAlertButton, MegaAlertType } from '../components/ui';

export type GlobalModalProps = {
  type: MegaAlertType;
  onClose: (id?: string | undefined) => void;
  title?: string;
  description?: string;
  state?: any;
  buttons?: MegaAlertButton[];
  isModal?: boolean;
  showLoading?: boolean;
};

type GlobalModalContextType = {
  showModal: (modal: GlobalModalProps) => void;
  hideModal: () => void;
  currentModalProps: GlobalModalProps | null;
};

export const GlobalModalContext = createContext<GlobalModalContextType>({
  showModal: (_: GlobalModalProps) => {},
  hideModal: () => {},
  currentModalProps: null,
});

export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal = ({ children }: PropsWithChildren) => {
  const [currentModalProps, setCurrentModalProps] =
    useState<GlobalModalProps | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (modalProps: GlobalModalProps) => {
    setCurrentModalProps(modalProps);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <GlobalModalContext.Provider
      value={{ currentModalProps, showModal, hideModal }}
    >
      {currentModalProps && (
        <MegaAlert
          isVisible={isModalVisible}
          type={currentModalProps.type}
          onClose={(id?: string | undefined) => {
            hideModal();
            currentModalProps.onClose(id);
          }}
          title={currentModalProps.title}
          description={currentModalProps.description}
          buttons={currentModalProps.buttons}
          isModal={currentModalProps.isModal}
          showLoading={currentModalProps.showLoading}
        />
      )}
      {children}
    </GlobalModalContext.Provider>
  );
};
