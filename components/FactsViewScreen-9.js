import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { styles } from "./Styles";
import { UserContext } from "../Context/UserContext";
import { useContext, useState, useEffect } from "react";
import { downloadImageUri } from "../utils/storageUtils";

const FactsViewScreen = ({ navigation, route }) => {

  const { userDetails, } = useContext(UserContext)

  const [postData, setPostData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [picData, setPicData] = useState([])

  useEffect(() => {  // retreives posts data from realtime db
    setIsLoading(true)


    const responseFromProp = route.params.paramKey
    const filteredData = responseFromProp.data.filter((entry) => !entry.hasOwnProperty("error"))  // removes error posts


    setPostData({ imgPath: responseFromProp.imgPath, data: filteredData })
  }, [])



  useEffect(() => {  // uses the posts data to retreive photo uris from firebase storage

    if (Object.keys(postData).length > 0) {
      const promise = Promise.resolve(downloadImageUri(postData.imgPath))
      promise.then((uri) => {
        setPicData(uri)
        setIsLoading(false)

      }).catch((error) => {
        console.log(error)
      })
    }
  }, [postData])

  return (
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
