import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';

import { Flags } from '../../utils/flags';

type FlagProps = {
  name: string;
  styles?: StyleProp<ImageStyle>;
};

export const Flag = (props: FlagProps) => {
  return (
    <Image
      style={[styles.image, props?.styles]}
      source={Flags.getCountryFlag(props.name)}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 25,
    height: 25,
  },
});
