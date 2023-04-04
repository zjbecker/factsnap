import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firebase";
import { UserContext } from "../Context/UserContext";
import * as SecureStore from "expo-secure-store";




const LoginForm = ({ animatedValue, navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { setUserDetails } = useContext(UserContext);






  useEffect(() => {
    // checks if user details are in storage and signs in if so. Also deals with navigation on sign in

    setIsLoading(true);

    const getDetails = async () => {
      // signs in if details present in storage
      try {
        const savedEmail = await SecureStore.getItemAsync("email");
        const savedPassword = await SecureStore.getItemAsync("password");

        if (savedEmail && savedPassword) {
          signInWithEmailAndPassword(auth, savedEmail, savedPassword)
            .then((userCredentials) => {
              const user = userCredentials.user;
              console.log("logged in with ", user.email);
              setUserDetails(user);
              saveDetails(savedEmail, savedPassword);
              setIsLoading(false);
            })
            .catch((error) => {
              alert(error.message);
            });
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        alert(error);
      }
    };

    getDetails();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      // deals with navigation after sign in
      if (user) {
        navigation.replace("Logged in Screen");
      }
    });

    return unsubscribe;
  }, []);

  const saveDetails = async (savedEmail = email, savedPassword = password) => {
    // saves user details in storage
    try {
      await SecureStore.setItemAsync("email", savedEmail);
      await SecureStore.setItemAsync("password", savedPassword);
    } catch (error) {
      alert(error);
    }
  };

  const handleSignup = () => {
    // signs in on firebase auth and saves user details in storage
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with ", user.email);
        setUserDetails(user);
        saveDetails();
       
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleLogin = () => {
    // logs in and saves details in storage
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("logged in with ", user.email);
        setUserDetails(user);
        saveDetails();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const loginBoxOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <Animated.View style={[styles.loginBox, { opacity: loginBoxOpacity }]}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signupButton}>
          <Text style={[styles.signUpText, { color: "white" }]}
          onPress={handleSignup} // think this and login back to front
          >Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}
          
          onPress={handleLogin}
          >Login</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loginBox: {
    position: "absolute",
    top: 290,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loginButton: {
    backgroundColor: "black",
    borderRadius: 4,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signupButton: {
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signUpText: {
    fontSize: 16,
    color: "white",
  },
  loginText: {
    fontSize: 16,
    color: 'white'
  }
});

export default LoginForm;