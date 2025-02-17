import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ContentTabItem } from '../../models';
import { MegaGradient, MegaText } from '../ui';

export type ContentTabProps = {
  tabs: ContentTabItem[];
  selected?: string;
  onChange: (key: string) => void;
};

export const ContentTab = (props: ContentTabProps) => {
  const onPressBtn = (key: string) => {
    props.onChange(key);
  };

  return (
    <View style={[styles.row, props.tabs.length !== 3 && styles.centeredRow]}>
      {props.tabs.map((tab) => (
        <TouchableOpacity key={tab.key} onPress={() => onPressBtn(tab.key)}>
          <MegaGradient
            styles={styles.gradient}
            color1={props.selected === tab.key ? '#E4F6C3' : 'transparent'}
            color2={props.selected === tab.key ? '#E1EEE7' : 'transparent'}
          >
            <View style={{ marginRight: 5 }}>{tab.icon}</View>
            <MegaText size={16} styles={{ color: '#5F6368', lineHeight: 24 }}>
              {tab.name}
            </MegaText>
          </MegaGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  centeredRow: {
    justifyContent: 'center',
    gap: 30,
  },
  gradient: {
    padding: 10,
    borderRadius: 10,
  },
});
