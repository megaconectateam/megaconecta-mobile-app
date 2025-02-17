import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { Colors } from '../../themes';
import { FontType, MegaText } from '../ui';

export type MenuListItem = {
  name: string;
  icon: React.ReactNode;
  value?: string;
  isPink?: boolean;
  route?: string;
  onPress?: Function;
};

export type MenuListProps = {
  title?: string;
  items: MenuListItem[];
};

export const MenuList = (props: MenuListProps) => {
  return (
    <View style={styles.container}>
      {props.title && (
        <View style={{ paddingTop: 10, paddingBottom: 5 }}>
          <MegaText
            size={16}
            font={FontType.bold}
            styles={{ lineHeight: 24, color: Colors.darkGreen }}
          >
            {props.title}
          </MegaText>
        </View>
      )}
      {props.items.map((item, index) => (
        <MenuListItemView
          key={index}
          {...item}
          isLast={index === props.items.length - 1}
        />
      ))}
    </View>
  );
};

const MenuListItemView = (props: MenuListItem & { isLast?: boolean }) => {
  const navigation = useNavigation();

  const onPress = () => {
    if (props.onPress) {
      props.onPress();
    } else if (props.route) {
      // @ts-ignore
      navigation.navigate(props.route);
    }
  };

  const gradientColors = ['#E4F6C3', '#E1EEE7'];
  const gradientColorsPink = ['#F3F1F6', '#FFDEE8'];

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.itemContainer}>
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={props.isPink ? gradientColorsPink : gradientColors}
            start={[0, 0]}
            end={[0, 1]}
            style={styles.iconGradient}
          >
            {props.icon}
          </LinearGradient>
        </View>
        <View
          style={[styles.textContainer, props.isLast && styles.noBorderBottom]}
        >
          <MegaText
            size={16}
            font={FontType.medium}
            styles={{ lineHeight: 24, color: Colors.primary }}
          >
            {props.name}
          </MegaText>
          {props.value && (
            <MegaText size={13} styles={{ lineHeight: 20 }}>
              {props.value}
            </MegaText>
          )}
        </View>
        <View
          style={[styles.arrowContainer, props.isLast && styles.noBorderBottom]}
        >
          <SVGs.ArrowListItem width={23} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: '#0300470D',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 3,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  itemContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },

  iconWrapper: {
    width: 40,
    height: 40,
    marginEnd: 10,
  },

  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#C5C5C5',
    borderBottom: 'rgba(197, 197, 197, 0.5)',
  },

  arrowContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,

    borderBottomWidth: 1,
    borderBottomColor: '#C5C5C5',
    borderBottom: 'rgba(197, 197, 197, 0.5)',
  },

  noBorderBottom: {
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
});
