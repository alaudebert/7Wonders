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
import Player from "./AddPlayer";

/** Game
 * Permet aux utilisateurs d'entrer leur nom et assigne une merveille à chaque utilisateur
 *
 * Game fait appel au composant Player
 *
 * @param {*} param0
 * @returns
 */
const Game = ({ route }) => {
  /** Le nombre de joueur dans la partie */
  const numberOfPlayers = route.params.PlayerNumber;
  /** Le nom de la partie */
  const gameName = route.params.Name;
  /** Le tableau de joueurs */
  const players = [];
  /** Nombre de joueurs*/
  const [turn, setTurn] = useState("");

  /**
   * createGame ajoute le nombre de joueurs dans la base de donnée
   */
  const createGame = () => {
    if (gameName) {
      update(ref(db, "Game/" + gameName), {
        PlayerNumber: numberOfPlayers,
      }).catch((error) => {
        alert(error);
      });
      if(turn < numberOfPlayers){
        alert("Valider le nom de chaque joueur avant de passer à la suite !");
      }
    }
  };

  const handleTurnChange = (turn) => {
    setTurn(turn);
  };

  // Boucle permettant d'afficher autant de composant Player que de joueurs dans la partie
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
        renderItem=/** Donne l'ordre de jeu du joueur et le nom de la partie en paramètre du composant player */
        {({ item }) => <Player turn={item.key} game={gameName} onTurnChange={handleTurnChange}
        />}
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
    width: "90%",
    backgroundColor: "#322202",
    borderRadius: 20,
    padding: 8,
    alignSelf: "center",
    margin: 8,
  },
  textButton: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});
