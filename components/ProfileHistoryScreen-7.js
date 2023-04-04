import React, { useContext, useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ImageBackground
} from "react-native";

import { UserContext } from "../Context/UserContext";
import { getUserPostsData } from "../utils/dbUtils";


const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = ITEM_WIDTH * 1.47;

const ProfileHistoryScreen = ({ navigation }) => {
  const { userDetails } = useContext(UserContext);

  const [postsData, setPostsData] = useState([]);
  const [picsData, setPicsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let pictureUris = [];

    getUserPostsData(userDetails)
      .then((data) => {
        const processedApiResults = data.map((entry) => {
          return entry[Object.keys(entry)];
        });
        processedApiResults.forEach((post) => {
          pictureUris.push(post.imgUri);
        });

        const promises = [
          Promise.resolve(setPostsData(processedApiResults)),
          Promise.resolve(setPicsData(pictureUris)),
        ];
        Promise.all(promises).then(() => {
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.log(error, "<<<< ERROR");
      });
  }, []);

  function viewIndividualResult(postIndex) {
    navigation.navigate("FactsView", {
      paramKey: postsData[postIndex],
    });
  }

  const goHome = () => {
    navigation.replace("Home");
  };

  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/BGvariant130.png')}
        style={styles.background}
      >

      {isLoading && <Text>Loading</Text>}
      {!isLoading && (
        <>
          <StatusBar hidden />
          <Animated.FlatList
            data={postsData}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            renderItem={({ item, index }) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];
              const translateX = scrollX.interpolate({
                inputRange,
                outputRange: [-width * 0.7, 0, width * 0.7],
              });

              return (
                <View
                  style={{
                    width,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 18,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 18,
                      shadowColor: "#000",
                      shadowOpacity: 0.5,
                      shadowRadius: 30,
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      borderRadius: 18,
                      padding: 12,
                      backgroundColor: "white",
                    }}
                  >
                    <View
                      style={{
                        width: ITEM_WIDTH,
                        height: ITEM_HEIGHT,
                        overflow: "hidden",
                        alignItems: "center",
                        borderRadius: 14,
                      }}
                    >
                      <Animated.Image
                        source={{ uri: picsData[index] }}
                        style={{
                          width: ITEM_WIDTH * 1.4,
                          height: ITEM_HEIGHT,
                          resizeMode: "cover",
                          transform: [
                            {
                              translateX,
                            },
                          ],
                        }}
                      />
                    </View>

                  </View>
                </View>
              );
            }}
          />
        </>
      )}
      <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
        <Text style={styles.homeBtnText}>Home</Text>
      </TouchableOpacity>
      </ImageBackground>
    </View>

  );
};

export default ProfileHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    width: ITEM_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    margin: 8,
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    overflow: "hidden",
    alignItems: "center",
    borderRadius: 14,
  },
  card: {
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    borderRadius: 18,
    padding: 12,
    backgroundColor: "white",
  },
  homeBtn: {
    alignSelf: "flex-start",

    backgroundColor: "#BADA55",
    padding: 10,
    marginLeft: 20,
    marginBottom: 20,
    borderRadius: 5,
  },
});
