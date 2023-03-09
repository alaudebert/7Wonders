import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Wonder from "./components/Wonders";
import Player from "./components/Player";
import Game from "./components/Game";
import RandomWonder from "./components/displayWonders";
import Wonders from "./components/Wonders";

export default App = () => {
  return (
    <View style={styles.container}>
      <RandomWonder />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
