import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { uploadImageAndRequestAPI } from "../utils/storageUtils";
import { UserContext } from "../Context/UserContext";
import { getUserPostsData, uploadAPIResults } from "../utils/dbUtils";
import { Camera } from "expo-camera";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Button,
  ImageBackground,
} from "react-native";
import { BackgroundGenerator } from "./BackgroundGenerator";
import { useFonts } from "expo-font";

// TO DO -

// ***** BLACK MARGIN ON PHOTO WHEN PHOTO DISPLAYED TO BE REVIEWED *****
// ***** SCREEN SIZE CHANGE ON CAMERA ----> IMAGE *****

const CameraScreen = ({ navigation }) => {
  const [loaded] = useFonts({
    RobotoMed: require("../assets/fonts/Roboto-Medium.ttf"),
  });
  const { userDetails } = useContext(UserContext); // needed here to set filepaths for firebase

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null); // holds photo id
  const [prevData, setPrevData] = useState([]); // holds users previous data
  const [apiResult, setApiResults] = useState({}); // once received, holds api facts. These get passed to fact view.
  const [imageStorageUri, setImageStorageUri] = useState(null);
  // These following two states will be used to control the UI to stop multiple submissions and notify
  // the user when the backend has responded with facts.
  const [submitted, setSubmitted] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  // Asks for camera permissions on page load

  useEffect(() => {
    const getCameraPermissionAsync = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setHasCameraPermission(true);
      }
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }
    };
    getCameraPermissionAsync();
  }, []);

  // Gets the users previous posts and sets in state.  Used to post more data and to determine new post id.
  useEffect(() => {
    getUserPostsData(userDetails).then((posts) => {
      if (posts) {
        setPrevData(posts);
      }
    });
  }, []);

  // Called on when pressed by camera button

  const takePicture = async () => {
    console.log("button pressed");
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      setPhotoUri(uri);
      console.log(uri, "uri");
    }
  };

  const discardBtnHandler = () => {
    setPhotoUri(null);
  };

  const analyseBtnHandler = () => {
    // This function is called by the analyse button.  It has dual functions of both submitting photo
    // for upload and going to the next screen, depending on the state of submitted and uploaded.
    // This will likely need reshuffling as we finalise the navigation and styling for this page as
    // the analyse button behaviour is just placeholder at the moment

    setSubmitted(true);

    if (!submitted) {
      // if not submitted yet, submit photo

      const thePath = `${userDetails.uid}/${prevData.length + 1}.jpg`;
      uploadImageAndRequestAPI(
        photoUri,
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

      setSubmitted(true);
    } else if (submitted && !uploaded) {
      // if submitted and processing, do not allow any repeat
      return;
    } else if (submitted && uploaded) {
      // if submitted and upladed, allow usee to view facts
      navigation.navigate("FactsView", {
        // pass facts to facts view
        paramKey: {
          imgPath: `${userDetails.uid}/${prevData.length}.jpg`,
          results: apiResult.data,
          imgUri: imageStorageUri,
        },
      });
    }
  };

  const goHome = () => {
    navigation.replace("Home");
  };
  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View></View>
        <BackgroundGenerator>
          {hasCameraPermission ? (
            <>
              <View style={styles.cameraFocusArea}>
                {photoUri ? (
                  <>
                    <Image
                      source={{ uri: photoUri }}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </>
                ) : (
                  <Camera
                    style={{ height: "100%", width: "100%" }}
                    type={Camera.Constants.Type.back}
                    ref={(ref) => setCameraRef(ref)}
                  />
                )}
              </View>

              <StatusBar style="auto" />

              <View style={styles.bottomActionsContainer}>
                {photoUri ? (
                  <View style={styles.photoButtonContainer}>
                    <TouchableOpacity
                      style={styles.photoButton}
                      onPress={discardBtnHandler}
                    >
                      <Text style={styles.photoButtonText}>Discard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.photoButton}
                      onPress={analyseBtnHandler}
                    >
                      <Text style={styles.photoButtonText}>
                        {!submitted && !uploaded
                          ? "Analyse"
                          : submitted && !uploaded
                          ? "loading..."
                          : submitted && uploaded
                          ? "Get Facts Now"
                          : ""}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={takePicture}
                  >
                    <View style={styles.outerCircle}>
                      <View style={styles.innerCircle} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>
                Enable Camera Permission to proceed
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
            <Text style={styles.homeBtnText}>Home</Text>
          </TouchableOpacity>
        </BackgroundGenerator>
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraFocusArea: {
    flex: 1,
    marginTop: "5%",
    width: "90%",
    maxHeight: "70%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 50,
  },
  bottomActionsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cameraButton: {
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 50,
    height: 80,
    justifyContent: "center",
    width: 80,
    marginBottom: 10,
    marginTop: 40,
  },
  outerCircle: {
    alignItems: "center",
    borderColor: "#FFF",
    borderRadius: 50,
    borderWidth: 6,
    height: 75,
    justifyContent: "center",
    width: 75,
  },
  innerCircle: {
    backgroundColor: "#FFFC00",
    borderRadius: 50,
    height: 60,
    width: 60,
    borderColor: "black",
    borderWidth: 2,
  },
  photoButtonContainer: {
    display: "flex",
    width: Dimensions.get("window").width * 0.8,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 50,
    marginBottom: 10,
  },
  photoButton: {
    backgroundColor: "#FFFC00",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 4,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
  },
  photoButtonText: {
    textAlign: "center",
    color: "black",
    fontFamily: "RobotoMed",
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
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },
  homeBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFC00",
    padding: 10,
    marginLeft: 20,
    marginBottom: 25,
    marginTop: 20,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
  },
  homeBtnText: {
    fontSize: 12,
    color: "black",
    fontFamily: "RobotoMed",
  },
});
