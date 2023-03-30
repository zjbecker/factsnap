import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { styles } from "./Styles";

const CameraScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Take Picture</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default CameraScreen;
