import Slider from '@react-native-assets/slider';
import { View } from 'react-native';
import { Colors } from '../../themes';

export type MegaSliderProps = {
  value: number;
  minValue: number;
  maxValue: number;

  onValueChange: (value: number) => void;
};

export const MegaSlider = (props: MegaSliderProps) => {
  return (
    <Slider
      value={props.value}
      minimumValue={props.minValue}
      maximumValue={props.maxValue}
      step={1}
      minimumTrackTintColor={Colors.darkGreen}
      maximumTrackTintColor={Colors.borderInput}
      thumbTintColor={Colors.darkGreen}
      trackHeight={6}
      thumbSize={27}
      slideOnTap
      onValueChange={props.onValueChange}
      CustomThumb={() => (
        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.darkGreen,
            width: 27,
            height: 27,
            borderRadius: 14,
            backgroundColor: Colors.white,
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: '25%',
              top: '25%',
              width: '50%',
              height: '50%',
              borderRadius: 5,
              backgroundColor: Colors.darkGreen,
            }}
          />
        </View>
      )}
    />
  );
};
