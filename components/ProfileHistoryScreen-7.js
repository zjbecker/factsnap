import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { styles } from "./Styles";
import { useContext, useState, useEffect } from "react"
import { UserContext } from "../Context/UserContext";
import { getUserPostsData } from "../utils/dbUtils";

const ProfileHistoryScreen = ({ navigation }) => {

  const { userDetails } = useContext(UserContext)

  const [postsData, setPostsData] = useState([])  // once loaded is an array of post objects
  const [picsData, setPicsData] = useState([])  // once loaded is an array of image uri strings, one per post
  const [isLoading, setIsLoading] = useState(true) // used to prevent data displaying before it has been retreived from firebase

  useEffect(() => {  // retreives posts data from realtime db and sets posts and pics data

    setIsLoading(true)
    let pictureUris = []

    getUserPostsData(userDetails)  // retreives the user data
      .then((data) => {

        const processedApiResults = data.map((entry) => {  // this bit just extracts the actual result object
          return entry[Object.keys(entry)]  
        })
        processedApiResults.forEach((post) => {  // extracts the uris from those result objects
          pictureUris.push(post.imgUri)
        })

        // these promises are just to ensure that setting state for posts and pictures happens before loading is set to false

        const promises = [Promise.resolve(setPostsData(processedApiResults)), Promise.resolve(setPicsData(pictureUris))]  
        Promise.all(promises)
        .then(() => {
          setIsLoading(false)
        })
      })

      .catch((error) => {
        console.log(error, "<<<< ERROR")
      })
  }, [])

  function viewIndividualResult(postIndex) {  // navigates to view the result
    navigation.navigate("FactsView", {  // pass facts to facts view
      paramKey: postsData[postIndex]})

  }


  return (  // placeholder stuff
    <View style={styles.container}>
      {isLoading &&
        <Text>Loading</Text>
      }
      {!isLoading &&
        <>
          <FlatList
            keyExtractor={(item, index) => index} 
            data={postsData}
            renderItem={({ item, index }) => (
              <View >

                <Image  source={{ uri: `${picsData[index]}` }} style={{ width: 200, height: 200 }} />
                <TouchableOpacity
                    onPress={() => {
                      viewIndividualResult(index)
                    }}
                  >
                    <Text>View</Text>
                  </TouchableOpacity>
              </View>

            )} />
          <StatusBar style="auto" />
        </>
      }

    </View>
  );
};

export default ProfileHistoryScreen;
