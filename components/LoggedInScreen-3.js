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
} from "react-native";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const LoggedInScreen = ({ navigation }) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ImageBackground
          source={require("../assets/BGvariant130.png")}
          style={styles.cardBackground}
        >
          <Text style={styles.logoText}>FactSnap</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={handleCameraPress}>
              <Image
                source={require("../assets/whiteCameraIcon.png")}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={handlePhotoLibraryPress}
            >
              <Image
                source={require("../assets/whitePhotoLibraryImage.png")}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Photo Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={handleProfileHistoryPress}
            >
              <Image
                source={require("../assets/profileHistory.png")}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Profile History</Text>
            </TouchableOpacity>
          </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
        </ImageBackground>
      </View>

      {/* <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity> */}
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
  },
  logoText: {
    fontSize: 60,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    color: "white",
  },
  card: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderRadius: 10,
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
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  option: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "25%",
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 15,
  },
  icon: {
    width: 80,
    height: 80,
  },
  optionText: {
    fontSize: 16,
    marginTop: 10,
    color: "white",
  },
  signOutButton: {
    alignSelf: "flex-start",
    marginBottom: 15,
    backgroundColor: "#BADA55",
    padding: 10,
    marginLeft: 20,

    borderRadius: 5,
  },
  signOutText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});
