import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { Colors } from '../../themes';
import { FontType, MegaModal, MegaText } from '../ui';

export type ConsentModalProps = {
  isVisible: boolean;
  title: string;
  mainDescription?: string;
  descriptions: string[];
  hideCheckMark?: boolean;
  onClose: () => void;
};

export const ConsentModal = ({
  descriptions,
  isVisible,
  mainDescription,
  onClose,
  title,
  hideCheckMark,
}: ConsentModalProps) => {
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
              {title}
            </MegaText>
          </View>

          <View style={{ position: 'absolute', top: 4, right: 0 }}>
            <TouchableOpacity onPress={() => onClose()}>
              <SVGs.CloseIcon />
            </TouchableOpacity>
          </View>
        </View>

        {mainDescription && (
          <View style={styles.mainTextContainer}>
            <MegaText
              size={16}
              styles={{
                lineHeight: 21,
                color: Colors.primary,
              }}
            >
              {mainDescription}
            </MegaText>
          </View>
        )}

        {descriptions.map((item, index) => (
          <View key={index} style={styles.textContainer}>
            {!hideCheckMark && (
              <View style={{ marginRight: 10, paddingTop: 5 }}>
                <SVGs.CircleGreenCheckIcon width={20} height={20} />
              </View>
            )}
            <View>
              <MegaText
                size={16}
                styles={{
                  lineHeight: 21,
                  color: Colors.primary,
                }}
              >
                {item}
              </MegaText>
            </View>
          </View>
        ))}
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
  textContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingRight: 20,
  },
  mainTextContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
});
