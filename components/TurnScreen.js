import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import { ref, get, update, onValue, remove } from "firebase/database";
import { db } from "./configuration";
import PlayerInformations from "./PlayerInformations";
import PlayersCards from "./PlayerCards";

/**
 * Permet d'afficher l'état du jeu actuel
 * @param {*} props contient le nom de la partie et l'ordre de jeu du joueur
 */
const Turn = (props) => {
  const game = props.game;
  const players = props.players;
  const [currentTurn, setCurrentTurn] = useState(0);
  const [playersCards, setPlayersCards] = useState([]);

  const cards = async () => {
    const cardRef = ref(db, "Card/Age 1");
    const cards = [];
    const snapshot = await get(cardRef); // attendre la récupération des données
    const card = snapshot.val();
    for (const [cardName, properties] of Object.entries(card)) {
      const prop = Object.keys(properties);
      const nbPlayers = Object.values(properties)[1];
      for (const nbPlayer of nbPlayers) {
        if (nbPlayer <= players) {
          cards.push(cardName);
        }
      }
    }
    return cards;
  };

  // Mélange aléatoires d'un tableau
  function randomCard(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  //Divise un tableau en n tableaux
  const distributeCards = (originalArray, n) => {
    const arrays = Array.from({ length: n }, () => []);

    originalArray.forEach((i, index) => {
      arrays[index % players].push(i);
    });
    return arrays;
  };

  //Fait tourner d'un cran le paquet de cartes
  const arrayRotation = () => {
    array = playersCards;
    const end = array[array.length - 1];
    for (let i = array.length - 1; i > 0; i--) {
      array[i] = array[i - 1];
    }
    array[0] = end;
    setCurrentTurn(0);
    setPlayersCards(array);
  };

  //Fait passer au joueur suivant
  const nextPlayerTurn = () => {
    let newCurrentTurn = currentTurn + 1;
    setCurrentTurn(newCurrentTurn);
  };

  // Renvoie un tableau contenant le tour du joueur et son nom
  const collectPlayers = () => {
    const playerGameRef = ref(db, "GamePlayer/" + game + "/");
    const [playerTurn, setPlayerTurn] = useState({});

    useEffect(() => {
      const unsubscribe = onValue(playerGameRef, (snapshot) => {
        const players = snapshot.val();
        let playerTurnObj = [];

        for (const [playerNum, player] of Object.entries(players)) {
          const game = Object.keys(player);

          let nbTurn = 0;
          for (const key of game) {
            const turn = player[key];
            nbTurn = turn;
          }
          playerTurnObj[nbTurn] = playerNum;
        }

        setPlayerTurn(playerTurnObj);
      });

      return () => unsubscribe();
    }, [playerGameRef]);

    return playerTurn;
  };

  //Récupère les joueurs de la partie et leur tour de jeu
  const playersTurn = collectPlayers();

  useEffect(() => {
    const fetchData = async () => {
      const cardsArray = await cards();
      const cardList = randomCard(cardsArray);
      const newPlayersCards = distributeCards(cardList, players);
      setPlayersCards(newPlayersCards);
    };
    fetchData();
  }, []);

  // Affiche "Loading..." si les données ne sont pas encore disponibles
  return (
    <ImageBackground
      source={require("../assets/agora.jpeg")}
      style={styles.background}
    >
      <View style={styles.container}>
        {playersCards.length > 0 ? (
          <View style={styles.flatListContainer}>
            <PlayerInformations
              player={playersTurn[currentTurn + 1]}
              turn={currentTurn + 1}
            />
            <PlayersCards deck={playersCards[currentTurn]} />
            {currentTurn + 1 !== players ? (
              <TouchableOpacity
                style={styles.button}
                onPress={nextPlayerTurn}
                title="next Player"
              >
                <Text>Joueur suivant</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={arrayRotation}
                title="Next turn"
              >
                <Text>Tour suivant</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Pour couvrir tout l'écran
  },
  container: {
    padding: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatListContainer: {
    alignItems: "center",
    marginTop: 50,
  },
});

export default Turn;
