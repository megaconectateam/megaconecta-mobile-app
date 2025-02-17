import ExpoConstants from 'expo-constants';
import * as React from 'react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  EmitterSubscription,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Colors, themeStyles } from '../../themes';

type Props = {
  centerContent?: boolean;
  children: React.ReactNode;
  FooterComponent?: React.ReactNode;
  HeaderComponent?: React.ReactNode;
  enableRefresh?: boolean;
  refresh?: () => void;
  isRefreshing?: boolean;
  extraScrollHeight?: number;
  useBottomSafeview?: boolean;
  noSpacing?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  footerWithTopBorder?: boolean;

  // for non-authenticated screens
  isExternal?: boolean;

  //When true, the FooterComponent will stay behind the keyboard. Defaults to false.
  keepFooterComponentAnchored?: boolean;
};

const KEYBOARD_VERTICAL_OFFSET = Platform.select({
  android: 0, // todo: guess real numbers here
  ios: 45 + ExpoConstants.statusBarHeight,
});

export type ScreenWithKeyboardRef = {
  scrollTo: (x: number, y: number) => void;
};

const ScreenWithKeyboardComponent = (
  {
    centerContent,
    children,
    HeaderComponent,
    FooterComponent,
    enableRefresh,
    refresh,
    isRefreshing,
    extraScrollHeight,
    useBottomSafeview = true,
    noSpacing,
    keepFooterComponentAnchored = false,
    containerStyle,
    footerWithTopBorder,
    isExternal,
  }: Props,
  ref: any,
): React.ReactElement => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  let keyboardWillShow: EmitterSubscription;
  let keyboardWillHide: EmitterSubscription;
  let keyboardDidShow: EmitterSubscription;
  let keyboardDidHide: EmitterSubscription;

  useImperativeHandle(ref, () => ({
    scrollTo: (x: number, y: number) => {
      scrollViewRef.current?.scrollTo({ x, y, animated: true });
    },
  }));

  useEffect(() => {
    function setKeyboardVisible() {
      setIsKeyboardVisible(true);
    }

    function setKeyboardNotVisible() {
      setIsKeyboardVisible(false);
    }

    if (Platform.OS === 'ios') {
      keyboardWillShow = Keyboard.addListener(
        'keyboardWillShow',
        setKeyboardVisible,
      );
      keyboardWillHide = Keyboard.addListener(
        'keyboardWillHide',
        setKeyboardNotVisible,
      );
    } else {
      keyboardDidShow = Keyboard.addListener(
        'keyboardDidShow',
        setKeyboardVisible,
      );
      keyboardDidHide = Keyboard.addListener(
        'keyboardDidHide',
        setKeyboardNotVisible,
      );
    }

    return () => {
      if (Platform.OS === 'ios') {
        keyboardWillShow && keyboardWillShow.remove();
        keyboardWillHide && keyboardWillHide.remove();
      } else {
        keyboardDidShow && keyboardDidShow.remove();
        keyboardDidHide && keyboardDidHide.remove();
      }
    };
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        testID="keyboard-avoiding-viewID"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
        style={[
          styles.container,
          !!containerStyle && containerStyle,
          isExternal && { backgroundColor: Colors.backgroundScreenExterior },
        ]}
      >
        {HeaderComponent && HeaderComponent}

        <ScrollView
          testID="scroll-viewID"
          ref={scrollViewRef}
          // contentInset={Platform.select({
          //   ios: { top: 0, bottom: 0, left: 0, right: 0 },
          //   android: undefined,
          // })}
          // onLayout={() => {
          //   if (
          //     isKeyboardVisible &&
          //     extraScrollHeight &&
          //     scrollViewRef.current
          //   ) {
          //     scrollViewRef.current.scrollTo({
          //       x: 0,
          //       y: extraScrollHeight,
          //       animated: true,
          //     });
          //   }
          // }}
          refreshControl={
            enableRefresh && refresh ? (
              <RefreshControl
                refreshing={isRefreshing || false}
                onRefresh={refresh}
              />
            ) : undefined
          }
          style={[
            styles.scrollView,
            isExternal && { backgroundColor: Colors.backgroundScreenExterior },
          ]}
          contentContainerStyle={
            centerContent
              ? [
                  styles.scrollViewContentContainerCentered,
                  noSpacing ? {} : { paddingHorizontal: 16 },
                ]
              : [
                  noSpacing
                    ? {}
                    : {
                        paddingTop: 16,
                        paddingHorizontal: 16,
                      },
                ]
          }
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {!keepFooterComponentAnchored && !!FooterComponent && (
          <View
            testID="footerID"
            style={[
              isKeyboardVisible
                ? styles.footerWithKeyboard
                : styles.footerWithoutKeyboard,
              !!footerWithTopBorder && styles.footerWithTopBorder,
              isExternal && {
                backgroundColor: Colors.backgroundScreenExterior,
              },
            ]}
          >
            {FooterComponent}
          </View>
        )}
      </KeyboardAvoidingView>
      {keepFooterComponentAnchored && (
        <View
          testID="footer-anchoredID"
          style={[
            styles.footerWithoutKeyboard,
            !!footerWithTopBorder && styles.footerWithTopBorder,
            isExternal && { backgroundColor: Colors.backgroundScreenExterior },
          ]}
        >
          {FooterComponent}
        </View>
      )}

      {FooterComponent && useBottomSafeview && (
        <SafeAreaView
          testID="bottom-safe-areaID"
          style={[
            styles.spacing,
            isExternal && { backgroundColor: Colors.backgroundScreenExterior },
          ]}
        />
      )}
    </>
  );
};

export const ScreenWithKeyboard = forwardRef<ScreenWithKeyboardRef, Props>(
  ScreenWithKeyboardComponent,
);

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundScreen,
    flex: 1,
    position: 'relative',
  },
  footerWithoutKeyboard: {
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundScreen,
  },
  footerWithKeyboard: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  footerWithTopBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    ...themeStyles.shadow,
  },
  scrollView: {
    backgroundColor: Colors.backgroundScreen,
    flex: 1,
  },
  scrollViewContentContainerCentered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  spacing: {
    backgroundColor: Colors.backgroundScreen,
    minHeight: 16,
  },
});
