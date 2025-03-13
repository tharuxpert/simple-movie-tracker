import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { useTheme } from "../lib/theme";
import { Feather } from "@expo/vector-icons";

interface LoaderProps {
  size?: number;
  color?: string;
}

export function Loader({ size = 48, color }: LoaderProps) {
  const { colors } = useTheme();
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel([spinAnimation, scaleAnimation]).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const reverseSpin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
    },
    outerRing: {
      position: "absolute",
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: (color || colors.primary) + "40",
    },
    innerRing: {
      position: "absolute",
      width: size * 0.7,
      height: size * 0.7,
      borderRadius: (size * 0.7) / 2,
      borderWidth: 2,
      borderColor: (color || colors.primary) + "80",
    },
    centerDot: {
      position: "absolute",
      width: size * 0.4,
      height: size * 0.4,
      borderRadius: (size * 0.4) / 2,
      backgroundColor: color || colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [{ rotate: spin }, { scale: scaleValue }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.innerRing,
          {
            transform: [{ rotate: reverseSpin }, { scale: scaleValue }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.centerDot,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      />
    </View>
  );
}
