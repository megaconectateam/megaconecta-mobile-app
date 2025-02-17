import LottieView from 'lottie-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Colors } from '../../themes';

export const OnBoardItem = ({ item }: { item: any }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <LottieView
        source={item.image}
        autoPlay
        loop
        style={[styles.image, { width }]}
      />
      <View style={styles.inner}>
        <Text style={styles.title}>{t(item.title)}</Text>
        <Text style={styles.description}>{t(item.description)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    top: 0,
    maxWidth: '95%',
    margin: 5,
    width: '100%',
  },
  title: {
    fontSize: 19,
    marginBottom: 5,
  },
  description: {
    fontSize: 13,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '100%',
  },
});
