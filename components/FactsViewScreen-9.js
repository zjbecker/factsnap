import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { styles } from "./Styles";

const FactsViewScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default FactsViewScreen;
