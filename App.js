import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Game from "./components/StartScreen";
import Home from "./components/HomeScreen";
import RandomWonder from "./components/displayWonders";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TurnScreen from "./components/TurnScreen";

export default App = () => {
  const Stack = createNativeStackNavigator();
  return <TurnScreen players={4} game={"Partie 1"}/>;
};
