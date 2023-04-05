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
  Pressable,
} from "react-native";
import { UserContext } from "../Context/UserContext";
import { getUserPostsData } from "../utils/dbUtils";
import { BackgroundGenerator } from "./BackgroundGenerator";
import { useFonts } from "expo-font";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = ITEM_WIDTH * 1.47;

const ProfileHistoryScreen = ({ navigation }) => {
  const [loaded] = useFonts({
    RobotoBlack: require("../assets/fonts/Roboto-Black.ttf"),
    RobotoMed: require("../assets/fonts/Roboto-Medium.ttf"),
  });
  const { userDetails } = useContext(UserContext);

  const [postsData, setPostsData] = useState([]);
  const [picsData, setPicsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userHasNoPosts, setUserHasNoPosts] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let pictureUris = [];

    getUserPostsData(userDetails)
      .then((data) => {
        if (!data) {
          setUserHasNoPosts(true);
          setIsLoading(false);
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

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <BackgroundGenerator>
        {isLoading && ( // if loading
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {!isLoading &&
          userHasNoPosts && ( // if user has no posts
            <View style={{ flex: 1 }}>
              <View style={styles.noPostTextContainer}>
                <Text
                  style={{
                    textAlign: "center",
                    maxWidth: "80%",
                    fontSize: 40,
                    color: "black",
                    marginTop: 20,
                    fontFamily: "RobotoMed",
                  }}
                >
                  You have no posts yet. Take a photo to get started.
                </Text>
              </View>
            </View>
          )}
        {!isLoading && !userHasNoPosts && (
          <View style={{ flex: 1 }}>
            <StatusBar hidden />
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                // marginBottom: "-50%",
                // marginTop: "-10%",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 30,
                  fontWeight: "bold",
                  color: "black",
                  fontFamily: "RobotoMed",
                }}
              >
                Your History
              </Text>
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
                        viewIndividualResult(index);
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
                          height: 0,
                        },
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.viewBtnText}>View</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        // delete function here
                      }}
                      style={{
                        backgroundColor: "white",
                        width: 20,
                        height: 20,
                        borderColor: "white",
                        borderWidth: 2,

                        position: "absolute",
                        bottom: "82%",
                        left: "15%",
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowRadius: 20,

                        alignItems: "center",
                      }}
                    >
                      <Text style={[{ color: "black", fontWeight: "bold" }]}>
                        X
                      </Text>
                    </Pressable>
                  </View>
                );
              }}
            />
          </View>
        )}
        <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
          <Text style={styles.homeBtnText}>Home</Text>
        </TouchableOpacity>
      </BackgroundGenerator>
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
    width: "100%",
    height: "100%",
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
    backgroundColor: "#FFFC00",
    padding: 10,
    marginLeft: 20,
    marginBottom: 20,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
  },
  background: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  loadingText: {
    width: "100%",
    fontSize: 40,
    color: "black",
    flexWrap: "wrap",
    fontFamily: "RobotoMed",
  },
  noPostsContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#FFFC00",
    height: "100%",
    width: "100%",
    paddingBottom: 30,
    borderBottomWidth: 5,
    borderColor: "white",
  },
  noPostsText: {
    width: "80%",
    fontSize: 30,
    color: "black",
    flexWrap: "wrap",
    fontFamily: "RobotoMed",
  },
  noPostTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  homeBtnText: {
    color: "black",
    fontFamily: "RobotoMed",
  },
  viewBtnText: {
    color: "black",
    fontFamily: "RobotoMed",
  },
});
