import * as React from "react";
import { useState } from "react";
import HomeScreen from "./components/HomeScreen-1";

import PhotoCapturedScreen from "./components/PhotoCapturedScreen-8";
import ProfileScreen from "./components/ProfileScreen-6";
import LoggedInScreen from "./components/LoggedInScreen-3";
import CameraScreen from "./components/CameraScreen-4";
import UploadScreen from "./components/UploadScreen-5";
import ProfileHistoryScreen from "./components/ProfileHistoryScreen-7";
import FactsViewScreen from "./components/FactsViewScreen-9";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from "./Context/UserContext";

const Stack = createNativeStackNavigator();


export default function App() {


  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen}
          options={{ headerShown: false }} />

          <Stack.Screen name="Logged in Screen" component={LoggedInScreen} 
          options={{ headerShown: false }}/>
          <Stack.Screen
            name="Camera"
            component={CameraScreen}

            options={{ headerShown: false }}
            
          />
          <Stack.Screen name="Upload" component={UploadScreen} 
          options={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen
            name="Profile-History"
            component={ProfileHistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="PhotoCaptured" component={PhotoCapturedScreen} />
          <Stack.Screen name="FactsView" component={FactsViewScreen}
          options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
