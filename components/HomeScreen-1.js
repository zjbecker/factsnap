import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Button } from "react-native";
import { styles } from "./Styles";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>FACTSNAP...</Text>
      <Button
        title="Camera View"
        onPress={() => navigation.navigate("Camera")}
      ></Button>
      <StatusBar style="auto" />
    </View>
  );
};

export default HomeScreen;
