import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Game from "./components/GameScreen";
import Home from "./components/HomeScreen";
import RandomWonder from "./components/displayWonders";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
        <Stack.Screen options={{headerShown: false}} name="Game" component={Game} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
