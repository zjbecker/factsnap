import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { styles } from "./Styles";

const LoggedInScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Logged In</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default LoggedInScreen;
