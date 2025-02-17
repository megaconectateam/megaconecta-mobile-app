import { View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { useTopup } from '../../providers';
import { MegaGradient } from '../ui';

export const FutureLabel = () => {
  const { isFuture, initialData } = useTopup();

  // if (isFuture === FutureEnum.none) {
  //   return null;
  // }

  return (
    <View>
      <MegaGradient>
        <View></View>
        <View></View>
        <View>
          <SVGs.ArrowListItem width={15} />
        </View>
      </MegaGradient>
    </View>
  );
};
