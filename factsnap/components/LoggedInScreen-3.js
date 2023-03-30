import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { auth } from "../firebase"
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';

const LoggedInScreen = ({ navigation }) => {

  const handleSignout = () => {  // changes auth state and erases user deails from storage

    const eraseDetails = async () => {
      try {
        await SecureStore.deleteItemAsync("email", {})
        await SecureStore.deleteItemAsync("password", {})
      } catch (error) {
        alert(error)
      }

    }

    eraseDetails()


    signOut(auth)
      .then(() => {
        navigation.replace("Login Screen")
      })
      .catch(error => alert(error.message))
  }


  return (
    <View style={styles.container}>
      <Text>Logged In</Text>
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity
        onPress={handleSignout}
        style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

export default LoggedInScreen;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
  },
  buttonContainer: {
      width: "60%",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 40,

  },
  button: {
      backgroundColor: "blue",
      width: "80%",
      padding: 15,
      borderRadius: 10,
      alignItems: "center"

  },
  buttonText: {
      color: "green",
      fontWeight: "700",
      fontSize: 16

  }
})