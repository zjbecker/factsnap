import * as React from "react";
import HomeScreen from "./components/HomeScreen-1";
import LogInScreen from "./components/LogInScreen-2";
import PhotoCapturedScreen from "./components/PhotoCapturedScreen-8";
import ProfileScreen from "./components/ProfileScreen-6";
import LoggedInScreen from "./components/LoggedInScreen-3";
import CameraScreen from "./components/CameraScreen-4";
import UploadScreen from "./components/UploadScreen-5";
import ProfileHistoryScreen from "./components/ProfileHistoryScreen-7";
import FactsViewScreen from "./components/FactsViewScreen-9";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from './Context/UserContext';

const Stack = createNativeStackNavigator()


export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          {/* <Stack.Screen name="Login Screen" component={LogInScreen} />
          <Stack.Screen name="Logged in Screen" component={LoggedInScreen} /> */}
          <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }}/>
          {/* <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Profile-History" component={ProfileHistoryScreen} />
          <Stack.Screen name="PhotoCaptured" component={PhotoCapturedScreen} />
          <Stack.Screen name="FactsView" component={FactsViewScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
