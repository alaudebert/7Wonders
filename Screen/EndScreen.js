import { View, Text, ImageBackground, StyleSheet } from "react-native";
import PlayerInformation from "../components/PlayerInformations";
import { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../components/configuration";

/**
 * Permet d'afficher les points et les gagnants de la partie
 * @param {*} props 
 * @returns 
 */
const End = (props) => {
  const players = props.route.params.players;
  const [playerScores, setPlayerScores] = useState([]);
  const [sortedPlayerScores, setSortedPlayerScores] = useState([]);

  useEffect(() => {
    const scores = [];
    for (const player of players) {
      const playerResourceRef = ref(db, "PlayerResource/" + player + "/");
      onValue(
        playerResourceRef,
        (snapshot) => {
          const playerResources = snapshot.val();
          const score =
            (playerResources.Army?.quantity ?? 0) +
            (Math.floor(playerResources.Treasure?.quantity / 3) ?? 0) +
            (playerResources.Win?.quantity ?? 0);
          setPlayerScores((prevState) => [...prevState, score]); // Ajout du score à l'état précédent
        },
        []
      );
    }
  }, [players]);

  useEffect(() => {
    const sortedScores = [...playerScores].sort((a, b) => b - a);
    setSortedPlayerScores(sortedScores);
  }, [playerScores]);

  const maxScore = sortedPlayerScores.length > 0 ? sortedPlayerScores[0] : 0;

  const bestPlayers = players.filter((player, index) => {
    return playerScores[index] === maxScore;
  });

  useEffect(() => {
    const steps = [1, 2, 3]; // Ajout d'un tableau de steps

    const updateWonderBuild = async (playerWonder, step) => {
      await update(ref(db, `Wonders/${playerWonder.Wonder}/${step}`), {
        Build: false,
      });
    };

    for (const player of players) {
      const playerResourceRef = ref(db, "PlayerWonder/" + player + "/");
      onValue(
        playerResourceRef,
        (snapshot) => {
          const playerWonder = snapshot.val();
          for (const step of steps) {
            // Parcours des steps pour chaque joueur
            updateWonderBuild(playerWonder, step);
          }
        },
        []
      );
    }
  }, [players]);

  return (
    <ImageBackground
      source={require("../assets/agora.jpeg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Le(les) meilleurs joueur(s)</Text>
          {bestPlayers.map((player) => (
            <Text key={player} style={styles.bestPlayer}>
              {player}
            </Text>
          ))}
        </View>
        <Text style={styles.end}>Fin de partie</Text>
        <View style={styles.card}>
          <Text style={styles.title}>Les points</Text>
          {playerScores.map((score, index) => (
            <Text key={index}>
              {players[index]} : {score} points
            </Text>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

export default End;

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    marginVertical: 10,
    borderColor: "#c9aa79",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  background: {
    flex: 1,
    resizeMode: "cover", // Pour couvrir tout l'écran
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#c9aa79",
  },
  bestPlayer: {
    fontSize: 16,
  },
  end: {
    fontSize: 40,
    fontWeight: "bold",
    backgroundColor: "#c9aa79",
    padding: 30,
    borderRadius: 20,
    color: "white",
  },
});
