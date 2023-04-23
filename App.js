import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Game from "./Screen/StartScreen";
import Home from "./Screen/HomeScreen";
import Turn from "./Screen/TurnScreen";
import End from "./Screen/EndScreen";
import RandomWonder from "./components/displayWonders";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Game"
          component={Game}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Turn"
          component={Turn}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="End"
          component={End}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
  //  <Wonders cityId="PA" city="Phare d’Alexandrie" /> <WonderStep player="Thomas" />;}
};
