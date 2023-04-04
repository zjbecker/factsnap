import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default ProfileScreen;
