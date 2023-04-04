import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import LoginForm from "../components/LoginForm";

const CIRCLE_SIZE = 100;

const Circle = ({ onPress, animatedValue, navigation }) => {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    let animationFrameId;

    const updateAnimationDone = () => {
      if (animatedValue.__getValue() >= 1 && !animationDone) {
        setAnimationDone(true);
      }
      animationFrameId = requestAnimationFrame(updateAnimationDone);
    };

    animationFrameId = requestAnimationFrame(updateAnimationDone);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [animatedValue, animationDone]);

  const handlePress = () => {
    if (!animationDone) {
      onPress();
    } else {
      // Handle form submission here
      console.log("Submitting form...");
    }
  };

  const containerBg = animatedValue.interpolate({
    inputRange: [0, 0.001, 0.5, 0.501, 1],
    outputRange: ["#FFFC00", "#FFFC00", "#FFFC00", "#FFFC00", "#FFFC00"],
    // outputRange: ["#0047AB", "#0047AB", "#0047AB", "white", "white"],
  });

  const circleBg = animatedValue.interpolate({
    inputRange: [0, 0.001, 0.5, 0.501, 1],
    // outputRange: ["white", "white", "white", "#27AE60", "#27AE60"],
    outputRange: ["white", "white", "white", "gold", "gold"],
  });

  const circleStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 0.5, 0.501, 1],
      outputRange: [1, 1, 0, 0],
    }),
    backgroundColor: circleBg,
    transform: [
      {
        perspective: 500,
      },
      {
        rotateY: animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ["0deg", "-90deg", "-360deg"],
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 8, 1],
        }),
      },
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, CIRCLE_SIZE / 2.2, 0],
        }),
      },
    ],
  };

  const renderCircleContent = () => {
    if (animatedValue.__getValue() < 0.5) {
      return <AntDesign name="arrowright" size={35} color={"black"} />;
    } else {
      return <Text style={styles.submitText}>Submit</Text>;
    }
  };

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.circleContainer,
        {
          backgroundColor: containerBg,
        },
      ]}
    >
      <Animated.View style={[styles.circle, circleStyle]}>
        <TouchableOpacity onPress={handlePress}>
          <View style={[styles.circle, styles.circleButton]}>
            {renderCircleContent()}
          </View>
        </TouchableOpacity>
      </Animated.View>
      <LoginForm animatedValue={animatedValue} navigation={navigation} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
  },
  circleContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 8,
    paddingBottom: 0,
  },
  circle: {
    backgroundColor: "#444",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE,
    marginBottom: 100,
  },
  circleButton: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    fontSize: 18,
    color: "#27AE60",
    fontWeight: "bold",
  },
});

export default Circle;
