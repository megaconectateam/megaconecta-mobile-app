import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../../themes';
import { MegaText } from './mega-text';

export const MegaLoading = ({ title }: { title?: string }) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <ActivityIndicator size={'large'} color={Colors.darkGreen} />

      {title && (
        <View style={{ paddingVertical: 20 }}>
          <MegaText styles={{ color: Colors.white }} size={21}>
            {title}
          </MegaText>
        </View>
      )}
    </View>
  );
};
