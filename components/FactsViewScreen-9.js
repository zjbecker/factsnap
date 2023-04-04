import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, PixelRatio, Image, TouchableOpacity, FlatList, ScrollView, ImageBackground } from "react-native";

// Kyle 
// Fonts not very readable, need some tweeking with colors and fonts, potentially a opacity on them. Might make it more readable with different background







import { useState, useEffect } from "react";

const FactsViewScreen = ({ navigation, route }) => {

  /* At the moment, this component has no front end, but the all the data from backend is saved in state -
  postData contains an array with objects, each object is a result from the API.  picData contains the picture
  url from firebase which can just be stuck straight in an Image tag and should work (once it's loaded) */

  console.log(route.params.paramKey)

  const [postData, setPostData] = useState([]) // once loaded is an array with api result objects (possible landmarks)
  const [picData, setPicData] = useState("") // once loaded is a uri of the photo, ready for use in image tag
  const [isLoading, setIsLoading] = useState(true) // may be unnecessary as there is no backend stuff going on on in this component, all data is being passed in from route. needs testing when app is more built


  console.log(postData, "<<<< postdata")
  useEffect(() => {  // processes post data passed as prop via route into state, sets pic data and post data
    setIsLoading(true)

    const responseFromProp = route.params.paramKey  // route.params.paramkey is received as a prop, contains the post object being viewed

    let filteredResults = []
    if (responseFromProp.hasOwnProperty("results")) {
      console.log("beeep")
      filteredResults = responseFromProp.results.filter((entry) => !entry.hasOwnProperty("error"))  // removes error posts
    }

    // these promises are just to ensure that setting state for posts and pictures happens before loading is set to false
    const promises = [Promise.resolve(setPicData(responseFromProp.imgUri)), Promise.resolve(setPostData(filteredResults))]
    Promise.all(promises)
      .then(() => {
        setIsLoading(false)
      })

  }, [])

  const goHome = () => {
    navigation.replace("Home");
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ImageBackground
          source={require('../assets/BGvariant130.png')}
          style={styles.cardBackground}
        >
          <View style={styles.cardContent}>
            {isLoading && <Text>Loading</Text>}
            {!isLoading && (
              <View style={styles.container}>
                <FlatList
                  ListHeaderComponent={
                    <>
                      <View style={styles.imageWrapper}>
                        <Image
                          source={{ uri: `${picData}` }}
                          style={styles.image}
                        />
                      </View>
                    </>
                  }
                  keyExtractor={(item, index) => index}
                  data={postData}
                  renderItem={({ item, index }) => (
                    <View>
                      <Text style={styles.title}>{item.landmark.title}</Text>
                      <Text style={styles.body}>{item.landmark.extract}</Text>
                    </View>
                  )}
                />
                <View style={styles.footer}>
                </View>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
        <Text style={styles.homeBtnText}>Home</Text>
      </TouchableOpacity>
        </ImageBackground>
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

export default FactsViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',

    overflow: 'hidden',
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  cardBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  body: {
    color: 'white',
    backgroundColor: 'transparent',
    borderRadius: 5,
    fontSize: 16,
    color: 'black',
  },
  homeBtn: {
    alignSelf: "flex-start",
    marginBottom: 20,
    backgroundColor: "#BADA55",
    padding: 10,
    marginLeft: 20,

    borderRadius: 5,
  },
  imageWrapper: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  marginTop: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});