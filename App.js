import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Wonder from "./components/Wonders";
import Player from "./components/Player";

export default App = () => {
  return (
    <View style={styles.container}>
      <Wonder />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
