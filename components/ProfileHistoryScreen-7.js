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
  ImageBackground,
  Pressable
} from "react-native";
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
]
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
  const [userHasNoPosts, setUserHasNoPosts] = useState(false)

  useEffect(() => {
    setIsLoading(true);
    let pictureUris = [];

    getUserPostsData(userDetails)
      .then((data) => {
        if (!data) {
          setUserHasNoPosts(true)
          setIsLoading(false)
        } else {
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
        }
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

  const randomIndex = Math.floor(Math.random() * imageBackgroundArray.length);
  const selectedImage = imageBackgroundArray[randomIndex];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={selectedImage}
        style={styles.background}
      >

        {isLoading && // if loading
          <View style={styles.loadingContainer}>

            <Text style={styles.loadingText}>Loading...</Text>


          </View>
        }

        {(!isLoading && userHasNoPosts) && // if user has no posts
          <View>
            <View style={styles.noPostsContainer} >
              <Text style={styles.noPostsText}>You have no posts yet. Take a photo to get started.</Text>

            </View>
          </View>

        }
        {(!isLoading && !userHasNoPosts)&& (
          <>
            <StatusBar hidden />
            <View style={{

              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              marginBottom: "-50%",
              marginTop: "-10%",


            }}>
              <Text style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "white"
              }}>Your History</Text>
            </View>
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
                    <Pressable
                      onPress={() => {
                        viewIndividualResult(index)
                      }}
                      style={{
                        backgroundColor: "white",
                        width: 100,
                        borderColor: "white",
                        borderWidth: 2,
                        padding: 6,
                        borderRadius: 14,
                        position: "absolute",
                        bottom: "16%",
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowRadius: 20,
                        shadowOffset: {
                          width: 0,
                          height: 0
                        },
                        alignItems: "center"

                      }}><Text>View</Text></Pressable>
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
  background: {
    width: "100%",
    height: "100%"
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  loadingText: {
    width: "50%",
    fontSize: 40,
    color: "white",
    flexWrap: "wrap"
  },
  noPostsContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#BADA55",

    paddingTop: 30,
    paddingBottom: 30,
    marginBottom: "110%",
    borderBottomWidth: 5,

    borderColor: "white"

  },
  noPostsText: {
    width: "80%",
    fontSize: 30,
    color: "white",
    flexWrap: "wrap"
  }
});
