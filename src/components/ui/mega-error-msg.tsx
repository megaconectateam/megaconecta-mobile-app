import LottieView from 'lottie-react-native';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../themes';
import { FontType, MegaText } from './mega-text';

export type MegaErrorMsgProps = {
  title?: string;
  message?: string;

  containerStyles?: StyleProp<ViewStyle>;
};

export const MegaErrorMsg = ({
  message,
  title,
  containerStyles,
}: MegaErrorMsgProps) => {
  if (!title && !message) return null;

  return (
    <View style={[styles.container, !!containerStyles && containerStyles]}>
      <View>
        <LottieView
          autoPlay
          style={{
            width: 48,
            height: 48,
          }}
          source={require('../../assets/animations/error.json')}
        />
      </View>
      <View style={{ flexDirection: 'column', flex: 1 }}>
        {!!title && (
          <View>
            <MegaText
              size={13}
              font={FontType.medium}
              styles={{ lineHeight: 16, color: Colors.primary }}
            >
              {title}
            </MegaText>
          </View>
        )}
        <View>
          <MegaText size={13} styles={{ lineHeight: 16 }}>
            {message}
          </MegaText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5EC',
    borderRadius: 12,
    padding: 10,
  },
});
