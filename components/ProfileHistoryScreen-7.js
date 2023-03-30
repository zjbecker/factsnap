import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { styles } from "./Styles";

const ProfileHistoryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>View Recent Vists</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default ProfileHistoryScreen;
