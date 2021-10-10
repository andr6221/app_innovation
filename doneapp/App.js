import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from "firebase";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import EventList from "./Components/EventList";
import Add_edit_Event from "./Components/Add_edit_Event";
import EventDetails from "./Components/EventDetails";
import Ionicons from "react-native-vector-icons/Ionicons";

//Vi sætter vores app sammen

export default function App() {

    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();
    //Konfigurer firebase
    const firebaseConfig = {
        apiKey: "AIzaSyC7qR7gNyS0lTRZwRpVIPeQdps08KkA0HE",
        authDomain: "fir-app-85cfa.firebaseapp.com",
        databaseURL: "https://fir-app-85cfa-default-rtdb.firebaseio.com",
        projectId: "fir-app-85cfa",
        storageBucket: "fir-app-85cfa.appspot.com",
        messagingSenderId: "203491219433",
        appId: "1:203491219433:web:dd4f67a5848a359e0f5d78"
    };


    // Vi kontrollerer at der ikke allerede er en initialiseret instans af firebase
    // Så undgår vi fejlen Firebase App named '[DEFAULT]' already exists (app/duplicate-app).

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const StackNavigation = () => {
        return(
            <Stack.Navigator>
                <Stack.Screen name={'Begivenheds liste'} component={EventList}/>
                <Stack.Screen name={'Event Details'} component={EventDetails}/>
                <Stack.Screen name={'Edit Event'} component={Add_edit_Event}/>
            </Stack.Navigator>
        )
    }

    return (
      <NavigationContainer>
          <Tab.Navigator>
              <Tab.Screen name={'Hjem'} component={StackNavigation} options={{tabBarIcon: () => ( <Ionicons name="home" size={20} />),headerShown:null}}/>
              <Tab.Screen name={'Tilføj begivenhed'} component={Add_edit_Event} options={{tabBarIcon: () => ( <Ionicons name="add" size={20} />)}}/>
          </Tab.Navigator>
      </NavigationContainer>
  );
}
