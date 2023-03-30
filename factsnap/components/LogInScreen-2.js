import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../Context/UserContext'
import * as SecureStore from 'expo-secure-store';

const LoginScreen = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const { setUserDetails } = useContext(UserContext)

    const navigation = useNavigation()

    useEffect(() => { // checks if user details are in storage and signs in if so. Also deals with navigation on sign in

        setIsLoading(true)

        const getDetails = async () => {   // signs in if details present in storage
            try {

                const savedEmail = await SecureStore.getItemAsync("email")
                const savedPassword = await SecureStore.getItemAsync("password")

                if (savedEmail && savedPassword) {

                    signInWithEmailAndPassword(auth, savedEmail, savedPassword)
                        .then(userCredentials => {
                            const user = userCredentials.user;
                            console.log("logged in with ", user.email)
                            setUserDetails(user)
                            saveDetails(savedEmail, savedPassword)
                            setIsLoading(false)
                        })
                        .catch((error) => {
                            alert(error.message)
                        })
                } else {
                    setIsLoading(false)
                }

            } catch (error) {
                alert(error)
            }

        }

        getDetails()

        const unsubscribe = auth.onAuthStateChanged(user => {  // deals with navigation after sign in
            if (user) {
                navigation.replace("Logged in Screen")
            }
        })

        return unsubscribe

    }, [])


    const saveDetails = async (savedEmail = email, savedPassword = password) => {  // saves user details in storage
        try {
            await SecureStore.setItemAsync("email", savedEmail)
            await SecureStore.setItemAsync("password", savedPassword)
        } catch (error) {
            alert(error)
        }

    }

    const handleSignup = () => {  // signs in on firebase auth and saves user details in storage
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Registered with ", user.email)
                setUserDetails(user)
                saveDetails()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleLogin = () => {  // logs in and saves details in storage
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("logged in with ", user.email)
                setUserDetails(user)
                saveDetails()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    return (<View style={styles.masterContainer}>

        {isLoading &&  // If user details saved it takes time to retrieve them, so this is displayed whilst loading
            <View style={styles.container} >
                <Text>Loading</Text>
            </View>
        }
        {!isLoading && 
            <View

                behavior="padding"
                style={styles.container}>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='Email'
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder='Password'
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={handleLogin}
                        style={styles.button}>
                        <Text style={styles.button}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSignup}
                        style={[styles.button, styles.buttonOutline]}>
                        <Text style={styles.buttonOutlineText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        }
    </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    masterContainer: {
        width: "100%",
        flex: 1,
        alignItems: 'center'
    },
    container: {
        flex: 1,
        width: "80%",
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainer: {
        width: "100%"

    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5

    },
    buttonContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,

    },
    button: {
        backgroundColor: "blue",
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center"

    },
    buttonOutline: {
        backgroundColor: "white",
        marginTop: 5,
        borderColor: "antiquewhite",
        borderWidth: 2

    },
    buttonOutlineText: {
        color: "green",
        fontWeight: "700",
        fontSize: 16


    },
    buttonText: {
        color: "green",
        fontWeight: "700",
        fontSize: 16

    }
})