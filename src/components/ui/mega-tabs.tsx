import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../themes';
import { FontType, MegaText } from './mega-text';

export type MegaTabsProps = {
  activeTab?: string;
  tabs: { id: string; label: string }[];
  onTabChange: (tab: string) => void;

  gradientStyles?: StyleProp<ViewStyle>;
};

export const MegaTabs = (props: MegaTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    props.activeTab || props.tabs[0].id,
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    props.onTabChange(tab);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.darkGreen, '#6AA500']}
        start={[0, 0]}
        end={[0, 1]}
        style={[styles.gradient, props.gradientStyles && props.gradientStyles]}
      >
        {props.tabs.map((tab) => (
          <View key={tab.id} style={styles.tab}>
            <TouchableOpacity onPress={() => handleTabChange(tab.id)}>
              <MegaText
                font={FontType.medium}
                size={15}
                styles={{ lineHeight: 29, color: '#E3F4C9' }}
              >
                {tab.label}
              </MegaText>
              <View
                style={[
                  styles.borderTab,
                  activeTab === tab.id && styles.borderTabActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        ))}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  gradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  tab: {},
  borderTab: {
    height: 4,
    width: '100%',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
  },
  borderTabActive: {
    backgroundColor: Colors.white,
  },
});
