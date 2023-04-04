
import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native'
import { UserContext } from '../Context/UserContext'
import { uploadImageAndRequestAPI } from '../utils/storageUtils';
import { uploadAPIResults, getUserPostsData } from '../utils/dbUtils';
import * as ImagePicker from "expo-image-picker"
import { BackgroundGenerator } from './BackgroundGenerator';
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { UserContext } from "../Context/UserContext";
import { uploadImageAndRequestAPI } from "../utils/storageUtils";
import { uploadAPIResults, getUserPostsData } from "../utils/dbUtils";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";

const imageBackgroundArray = [
  require("../assets/BGvariant130.png"),
  require("../assets/BGvariantBigBen.png"),
  require("../assets/BGvariantBurjKhalifa.png"),
  require("../assets/BGvariantColosseum.png"),
  require("../assets/BGvariantGoldenBridge.png"),
  require("../assets/BgVariantdubaiv2.png"),
  require("../assets/BGvariantEgyptCity.png"),
  require("../assets/BGVariantNYC.png"),
  require("../assets/BGvariantPyramidsv2.png"),
  require("../assets/BGvariantRomev2.png"),
  require("../assets/BGvariantVenice.png"),
  require("../assets/BGvariantRomev2.png"),
  require("../assets/BGvariantSyndneyHousev2.png"),
  require("../assets/BGvariantVenicev2.png"),
];

function UploadScreen({ navigation }) {
  const [loaded] = useFonts({
    RobotoBlack: require("../assets/fonts/Roboto-Black.ttf"),
  });

  // User context is needed here to set the directory name for firebase
  const { userDetails } = useContext(UserContext);

  const [prevData, setPrevData] = useState([]); // used to set filename ids and to save new entries
  const [image, setImage] = useState(null); // once picked the image local uri is stored here
  const [apiResult, setApiResults] = useState({}); // this is passed to the results page once set
  const [imageStorageUri, setImageStorageUri] = useState(null);

  // these two states are used to control the ui and stop the user submitting multiple times
  const [submitted, setSubmitted] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  // Gets the users previous posts and sets in state.  Used to post more data and to determine new post id.
  useEffect(() => {
    getUserPostsData(userDetails).then((posts) => {
      if (posts) {
        setPrevData(posts);
      }
    });
  }, []);

  // Selects a photo from the user device memory

  const selectPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // We can specify whether we need only Images or Videos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, // 0 means compress for small size, 1 means   compress for maximum quality
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // writes the chosen photo into the backend / firebase and puts the result into state

  function writeUserData() {
    setSubmitted(true);

    const thePath = `${userDetails.uid}/${prevData.length + 1}.jpg`;
    uploadImageAndRequestAPI(
      image,
      userDetails,
      prevData.length + 1,
      thePath
    ).then((response) => {
      setApiResults(response);
      uploadAPIResults(response.data, userDetails, prevData, thePath).then(
        (imgUri) => {
          setImageStorageUri(imgUri);
          setUploaded(true);
        }
      );
    });
  }

  function viewResults() {
    navigation.navigate("FactsView", {
      paramKey: {
        imgPath: `${userDetails.uid}/${prevData.length}.jpg`,
        results: apiResult.data,
        imgUri: imageStorageUri,
      },
    });
  }

  const goHome = () => {
    navigation.replace("Home");
  };



  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ImageBackground source={selectedImage} style={styles.cardBackground}>
          <Text style={styles.logoText}>FACTSNAP</Text>
          <View style={styles.imageContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ height: "100%", width: "100%" }}
              />
            ) : (
              <Text style={styles.imagePlaceholder}>
                Select an image to display here
              </Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {!image && (
              <TouchableOpacity
                onPress={() => {
                  selectPhoto(setImage);
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Add Pic</Text>
              </TouchableOpacity>
            )}

            {image && !uploaded && !submitted && (
              <TouchableOpacity onPress={writeUserData} style={styles.button}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            )}

            {image && submitted && (
              <TouchableOpacity
                onPress={() => {
                  if (uploaded) {
                    viewResults();
                  }
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {uploaded ? "Go" : "loading..."}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
            <Text style={styles.homeBtnText}>Home</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 50,
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 15,
    fontFamily: "RobotoBlack",
  },
  card: {
    width: "100%",
    height: "100%",
    alignSelf: "center",


    overflow: "hidden",
    shadowColor: "#000",
    marginBottom: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.62,
    elevation: 4,
    backgroundColor: "#FFF",
  },
  cardBackground: {
    flex: 1,
    resizeMode: "cover",
    alignItems: 'center',
  },
  imageContainer: {
    width: "90%",
    height: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.4)", 
    
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePlaceholder: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#BADA55",
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 40,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  homeBtn: {
    alignSelf: "flex-start",

    backgroundColor: "#BADA55",
    padding: 10,
    marginLeft: 20,

    borderRadius: 5,
  },
});

export default UploadScreen;
