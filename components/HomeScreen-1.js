import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { styles } from "./Styles";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>FACTSNAP...</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default HomeScreen;
