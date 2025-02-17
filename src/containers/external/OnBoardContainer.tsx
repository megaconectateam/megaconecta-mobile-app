import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import slides from '../../assets/slides';
import { Paginator } from '../../components';
import { MegaButton } from '../../components/ui';
import { LocalStorageService } from '../../utils';
import { OnBoardItem } from './OnBoardItemContainer';

export const OnBoardContainer = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      setCurrentIndex(viewableItems[0].index);
    },
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const flatListRef = useRef<FlatList>(null);

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: currentIndex + 1,
      });
    } else {
      goToLogin();
    }
  };

  const goToLogin = () => {
    LocalStorageService.setOnBoardVisited();
    navigation.navigate('LoginSms');
  };

  const background = require('../../assets/background/mainback.png');

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={background} style={styles.imageBackground}>
        <View style={styles.sectionMiddle}>
          <FlatList
            data={slides}
            renderItem={({ item }) => <OnBoardItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false,
              },
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={flatListRef}
          />
        </View>
        <View style={styles.sectionBottom}>
          <View style={styles.paginator}>
            <Paginator data={slides} scrollX={scrollX} />
          </View>
          <MegaButton
            text={t('continue')}
            variant="light-secondary"
            onPress={goToNext}
            containerStyles={{ marginBottom: 10 }}
          />
          <MegaButton
            text={t('skip')}
            variant="light-secondary"
            onPress={goToLogin}
            containerStyles={{ marginBottom: 10 }}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  sectionMiddle: {
    flex: 3,
  },
  sectionBottom: {
    flex: 1,
    marginHorizontal: 30,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  paginator: {
    alignItems: 'center',
    height: 40,
  },
});
