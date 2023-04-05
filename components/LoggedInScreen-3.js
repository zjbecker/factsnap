import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  SafeAreaView,
} from "react-native";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigation, useState } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { BackgroundGenerator } from "./BackgroundGenerator";
import { useFonts } from "expo-font";

const LoggedInScreen = ({ navigation }) => {
  const [loaded] = useFonts({
    RobotoBlack: require("../assets/fonts/Roboto-Black.ttf"),
    RobotoMed: require("../assets/fonts/Roboto-Medium.ttf"),
  });
  const handleSignOut = () => {
    const eraseDetails = async () => {
      try {
        await SecureStore.deleteItemAsync("email", {});
        await SecureStore.deleteItemAsync("password", {});
      } catch (error) {
        alert(error);
      }
    };

    eraseDetails();

    signOut(auth)
      .then(() => {
        navigation.replace("Home");
      })
      .catch((error) => alert(error.message));
  };

  const handleCameraPress = () => {
    console.log("pressed");
    navigation.replace("Camera");
  };

  const handlePhotoLibraryPress = () => {
    console.log("pressed");
    navigation.replace("Upload");
  };

  const handleProfileHistoryPress = () => {
    console.log("pressed");
    navigation.replace("Profile-History");
  };
  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <BackgroundGenerator>
          <SafeAreaView>
            <Text
              style={styles.logoText}
              adjustsFontSizeToFit={true}
              numberOfLines={1}
            >
              F A C T S N A P
            </Text>
          </SafeAreaView>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={handleCameraPress}>
              <Text style={[styles.optionText, { textAlign: "center" }]}>
                Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={handlePhotoLibraryPress}
            >
              <Text style={styles.optionText}>Photo Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={handleProfileHistoryPress}
            >
              <Text style={styles.optionText}>Profile History</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </BackgroundGenerator>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

export default LoggedInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 50,
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "RobotoBlack",
    justifyContent: "center",
    textAlignVertical: "center",
  },
  card: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  cardBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    bottom: 10,
    left: 10,
    zIndex: 1,
  },
  backArrow: {
    fontSize: 60,
    fontWeight: "bold",
    fontFamily: "RobotoMed",
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    paddingTop: 100,
  },
  option: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "10%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginLeft: 15,
  },
  optionText: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    fontFamily: "RobotoMed",
  },
  signOutButton: {
    alignSelf: "flex-start",
    marginBottom: 50,
    backgroundColor: "#FFFC00",
    padding: 11,
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
  },
  signOutText: {
    fontSize: 12,
    fontFamily: "RobotoMed",
    color: "black",
  },
});
