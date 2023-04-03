
import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { UserContext } from '../Context/UserContext'
import { uploadImageAndRequestAPI } from '../utils/storageUtils';
import { uploadAPIResults, getUserPostsData } from '../utils/dbUtils';
import * as ImagePicker from "expo-image-picker"


function UploadScreen({ navigation }) {

  // User context is needed here to set the directory name for firebase
  const { userDetails } = useContext(UserContext)

  const [prevData, setPrevData] = useState([])  // used to set filename ids and to save new entries
  const [image, setImage] = useState(null)  // once picked the image local uri is stored here
  const [apiResult, setApiResults] = useState({})   // this is passed to the results page once set
  const [imageStorageUri, setImageStorageUri] = useState(null)

  // these two states are used to control the ui and stop the user submitting multiple times
  const [submitted, setSubmitted] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  // Gets the users previous posts and sets in state.  Used to post more data and to determine new post id.
  useEffect(() => {
    getUserPostsData(userDetails)
      .then((posts) => {
        if (posts) {
          setPrevData(posts)
        }
      })
  }, [])


  // Selects a photo from the user device memory

  const selectPhoto = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // We can specify whether we need only Images or Videos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,   // 0 means compress for small size, 1 means   compress for maximum quality
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);

    }

  }

  // writes the chosen photo into the backend / firebase and puts the result into state

  function writeUserData() {
    setSubmitted(true)


    const thePath = `${userDetails.uid}/${(prevData.length + 1)}.jpg`
    uploadImageAndRequestAPI(image, userDetails, (prevData.length + 1), thePath)

      .then((response) => {
        setApiResults(response)
        uploadAPIResults(response.data, userDetails, prevData, thePath)
          .then((imgUri) => {
            setImageStorageUri(imgUri)
            setUploaded(true)

          })

      })


  }

  function viewResults() {
    navigation.navigate("FactsView", {
      paramKey: { imgPath: `${userDetails.uid}/${prevData.length}.jpg`, results: apiResult.data, imgUri: imageStorageUri }
    })

  }

  return (
    <View
      style={styles.container}
      behavior="padding">

      {!image &&  // Displayed before the user has picked an image
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              selectPhoto(setImage)
            }}
            style={styles.button}>
            <Text style={styles.button}>Add Pic</Text>
          </TouchableOpacity>
        </View>
      }


      {(image && !uploaded && !submitted) &&  // displays once an image is picked but before submission
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={writeUserData}
            style={styles.button}>
            <Text style={styles.button}>Submit</Text>
          </TouchableOpacity>


        </View>
      }

      {(image && submitted) &&  // displays once the image has been submitted
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              if (uploaded) {
                viewResults()

              }
            }}
            style={styles.button}>
            <Text style={styles.button}>{(uploaded) ? "Go" : "loading..."}</Text>
          </TouchableOpacity>


        </View>
      }


      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.replace("Home")
          }}
          style={styles.button}>
          <Text style={styles.button}>BACK</Text>
        </TouchableOpacity>


      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,

  },
  button: {
    backgroundColor: "aquamarine",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"

  }
})




export default UploadScreen