import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Game from "./components/StartScreen";
import Home from "./components/HomeScreen";
import Turn from "./components/TurnScreen";
import RandomWonder from "./components/displayWonders";
import { NavigationContainer } from "@react-navigation/native";
import WonderStep from "./components/WonderStep";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default App = () => {
  const Stack = createNativeStackNavigator();
  return <Turn players={4} game={"Partie 1"} />;
  // <Turn players={4} game={"Partie 1"}/> <Wonders cityId="PA" city="Phare d’Alexandrie" /> <WonderStep player="Thomas" />;}
};
