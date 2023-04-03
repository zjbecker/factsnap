import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, PixelRatio } from "react-native";
import { styles } from "./Styles";

import { useState, useEffect } from "react";

const FactsViewScreen = ({ navigation, route }) => {

  /* At the moment, this component has no front end, but the all the data from backend is saved in state -
  postData contains an array with objects, each object is a result from the API.  picData contains the picture
  url from firebase which can just be stuck straight in an Image tag and should work (once it's loaded) */

  console.log(route.params.paramKey)

  const [postData, setPostData] = useState([]) // once loaded is an array with api result objects (possible landmarks)
  const [picData, setPicData] = useState("") // once loaded is a uri of the photo, ready for use in image tag
  const [isLoading, setIsLoading] = useState(true) // may be unnecessary as there is no backend stuff going on on in this component, all data is being passed in from route. needs testing when app is more built

  useEffect(() => {  // processes post data passed as prop via route into state, sets pic data and post data
    setIsLoading(true)
    
    const responseFromProp = route.params.paramKey  // route.params.paramkey is received as a prop, contains the post object being viewed
    const filteredResults = responseFromProp.results.filter((entry) => !entry.hasOwnProperty("error"))  // removes error posts

    // these promises are just to ensure that setting state for posts and pictures happens before loading is set to false
    const promises = [Promise.resolve(setPicData(responseFromProp.imgUri)), Promise.resolve(setPostData(filteredResults))]
    Promise.all(promises)
      .then(() => {
        setIsLoading(false)
      })

  }, [])

  return (  // placeholder stuff
    <View style={styles.container}>
      {isLoading &&
        <Text>Loading</Text>}


      {!isLoading &&
        <>
          <Text>Stuff goes here</Text>
          <StatusBar style="auto" />
        </>

      }

    </View>
  );
};

export default FactsViewScreen;
