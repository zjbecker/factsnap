import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";

const PhotoCapturedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>View Picture</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default PhotoCapturedScreen;
