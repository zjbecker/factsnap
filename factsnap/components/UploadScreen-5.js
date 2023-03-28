import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { styles } from "./Styles";

const UploadScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Upload Image</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default UploadScreen;
