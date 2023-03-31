import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { uploadImage } from "../utils/storageUtils";
import { UserContext } from '../Context/UserContext'
import { getDatabase, ref, onValue, set } from "firebase/database";
import { uploadAPIResults } from "../utils/dbUtils";


// import { styles } from "./Styles";
import { Camera } from "expo-camera";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Button,
} from "react-native";

// TO DO -

// ***** BLACK MARGIN ON PHOTO WHEN PHOTO DISPLAYED TO BE REVIEWED *****
// ***** SCREEN SIZE CHANGE ON CAMERA ----> IMAGE *****

const CameraScreen = ({ navigation}) => {

  const [apiResult, setApiResults] = useState({})



  // const {setApiResults} = route.params

  const { userDetails, } = useContext(UserContext)
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null); // holds photo id
  const [prevData, setPrevData] = useState([])  // holds users previous data

  // These following two states will be used to control the UI to stop multiple submissions and notify
  // the user when the backend has responded with facts.  Currently unused, but passed to uploadImage
  const [submitted, setSubmitted] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const db = getDatabase()

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

  // Load user data so it can be saved with the new post

  useEffect(() => {

    const queryRef = ref(db, userDetails.uid);
    onValue(queryRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setPrevData(data.posts)
      }


    })
  }, [])

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

    setSubmitted(true)

    if (!submitted) {


      const thePath = `${userDetails.uid}/${(prevData.length + 1)}.jpg`
      uploadImage(photoUri, userDetails, (prevData.length + 1), thePath)

        .then((response) => {
          setApiResults(response)
          uploadAPIResults(response.data, userDetails, prevData, thePath)
            .then(() => {
              setUploaded(true)

            })

        })

      setSubmitted(true);
    }

    else if (submitted && !uploaded) {
      return
    }

    else if (submitted && uploaded) {
      navigation.navigate("FactsView", {
        paramKey: {imgPath: `${userDetails.uid}/${prevData.length}.jpg`, data: apiResult.data}})
    }

  };

  return (
    <View style={styles.container}>
      {hasCameraPermission ? (
        <>
          <View style={styles.cameraFocusArea}>
            {photoUri ? (
              <>
                <Image
                  source={{ uri: photoUri }}
                  style={{ height: "100%", width: "100%" }}
                />
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
                    <Text style={styles.photoButtonText}>{(!submitted && !uploaded) ? "Analyse" : (submitted && !uploaded) ? "loading..." : (submitted && uploaded) ? "Get Facts Now" : ""}</Text>
                  </TouchableOpacity>

                </View>
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

          {!photoUri && (
            <View
              style={
                photoUri
                  ? styles.cameraBtnContainer
                  : styles.cameraBtnContainerNoPhoto
              }
            >
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <View style={styles.cameraButton}>
                  <View style={styles.outerCircle}>
                    <View style={styles.innerCircle} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.container}>
          <Text>Enable Camera Permission to proceed</Text>
        </View>
      )}
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
    position: "absolute",
    top: Dimensions.get("window").height / 6.3,
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height / 1.7,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "black",
  },
  cameraBtnContainer: {
    position: "absolute",
    bottom: 70,
  },
  cameraButton: {
    alignItems: "center",
    backgroundColor: "#FFCD29",
    borderRadius: 50,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  cameraBtnContainerNoPhoto: {
    position: "absolute",
    bottom: 70,
    marginTop: 70,
  },
  outerCircle: {
    alignItems: "center",
    borderColor: "#FFF",
    borderRadius: 50,
    borderWidth: 2,
    height: 70,
    justifyContent: "center",
    width: 70,
  },
  innerCircle: {
    backgroundColor: "white",
    borderRadius: 50,
    height: 50,
    width: 50,
  },
  photoButtonContainer: {
    display: "flex",
    width: Dimensions.get("window").width * 0.8,
    flexDirection: "row",

    justifyContent: "space-around",
  },
  photoButton: {
    backgroundColor: "black",
    width: Dimensions.get("window").width * 0.25,
    height: 25,
    borderRadius: 20,
    alignContent: "center",
    marginTop: 60,
  },
  photoButtonText: {
    textAlign: "center",
    color: "white",
  },
});
