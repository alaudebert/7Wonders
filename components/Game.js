import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "./configuration";
import Player from "./Player";

const Game = ({ route }) => {
  const numberOfPlayers = route.params.PlayerNumber;
  const gameName = route.params.Name;
  const players = [];

  const createGame = () => {
    if (gameName) {
      update(ref(db, "Game/" + gameName), {
        PlayerNumber: numberOfPlayers,
      })
        .then(() => {
          // Data saved successfully!
          alert("data updated!");
        })
        .catch((error) => {
          // The write failed...
          alert(error);
        });
    }
  };

  for (let i = 1; i <= numberOfPlayers; i++) {
    players.push({ key: i.toString() });
  }

  return (
    <ImageBackground
      source={require("../assets/agora.jpeg")}
      style={styles.background}
    >
      <Text style={styles.title}> Joueurs</Text>
      <FlatList
        data={players}
        renderItem={({ item }) => <Player turn={item.key} game={gameName} />}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={createGame}
        title="Jouer"
      >
        <Text style={styles.textButton}>Jouer</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default Game;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Pour couvrir tout l'écran
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    padding: 10,
    paddingTop: 50,
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    width: "100%",
    backgroundColor: "#107657",
    borderRadius: 20,
    padding: 8,
  },
});
