import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { LottieResources } from '../../assets/animations';
import { SVGs } from '../../assets/svg';
import { useTopup } from '../../providers';
import { Colors } from '../../themes';
import { FontType, MegaText } from '../ui';

export type CartIconProps = {
  onPress?: () => void;
};

export const TopupCartIcon = ({ onPress }: CartIconProps) => {
  const animationRef = useRef<LottieView>(null);
  const { cartItems } = useTopup();

  useEffect(() => {
    if (cartItems.length > 0) {
      animationRef.current?.play();
    } else {
      animationRef.current?.reset();
    }
  }, [cartItems.length]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <LottieView
          ref={animationRef}
          loop={false}
          duration={2000}
          style={{
            width: 30,
            height: 30,
            position: 'absolute',
            top: 0,
          }}
          source={LottieResources.whiteStars}
        />

        <View style={styles.textContainer}>
          <MegaText
            size={16}
            font={FontType.medium}
            styles={{
              lineHeight: 27,
              color: Colors.white,
              textAlign: 'center',
            }}
          >
            {cartItems.length}
          </MegaText>
        </View>
        <SVGs.CartIcon width={25} height={25} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    top: -10,
    width: '100%',
    paddingLeft: 5,
  },
});
