import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { styles } from "./Styles";

const LogInScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Login...</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default LogInScreen;
