import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet, View, Animated, Image, Text } from "react-native";
import { useFonts } from "expo-font";

import Circle from "../animations/Circle";

const CIRCLE_SIZE = 100;

const HomeScreen = ({ navigation }) => {
  const [loaded] = useFonts({
    RobotoBlack: require("../assets/fonts/Roboto-Black.ttf"),
  });
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const animation = (toValue) =>
    Animated.timing(animatedValue, {
      toValue,
      duration: 1700,
      useNativeDriver: false,
    });

  const onPress = () => {
    animation(1).start();
  };

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden />
      <Circle
        onPress={onPress}
        animatedValue={animatedValue}
        navigation={navigation}
      />

      <View style={styles.logoContainer}>
        <Text
          style={styles.logoText}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        >
          FACTSNAP
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
  },

  logoText: {
    fontSize: 50,
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 11,
    fontFamily: "RobotoBlack",
    justifyContent: "center",
    textAlignVertical: "center",
  },
});

export default HomeScreen;
