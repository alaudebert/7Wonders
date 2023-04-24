import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import { ref, get, update, onValue, remove } from "firebase/database";
import { db } from "../components/configuration";
import PlayerInformations from "../components/PlayerInformations";
import PlayersCards from "../components/PlayerCards";
import { SafeAreaView } from "react-native-safe-area-context";
import WonderStep from "../components/WonderStep";

/**
 * Permet d'afficher l'état du jeu actuel
 * @param {*} props contient le nom de la partie et l'ordre de jeu du joueur
 */
const Turn = (props) => {
  const [showDialog, setShowDialog] = useState(false);

  const game = props.route.params.game;
  const playerNumber = props.route.params.players;
  const [players, setPlayers] = useState([]);
  //const game = props.game;
  //const players = props.players;
  const [currentTurn, setCurrentTurn] = useState(0);
  const [playersCards, setPlayersCards] = useState([]);
  const [isPlay, setIsPlay] = useState(false);

  const cards = async () => {
    const cardRef = ref(db, "Card/Age 1");
    const cards = [];
    const snapshot = await get(cardRef); // attendre la récupération des données
    const card = snapshot.val();
    for (const [cardName, properties] of Object.entries(card)) {
      const prop = Object.keys(properties);
      const nbPlayers = Object.values(properties)[1];
      for (const nbPlayer of nbPlayers) {
        if (nbPlayer <= playerNumber) {
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
      arrays[index % playerNumber].push(i);
    });
    return arrays;
  };

  //Fait tourner d'un cran le paquet de cartes
  const arrayRotation = () => {
    const array = playersCards;

    if (playersCards.length == 4) {
      props.navigation.push("End", { players: players });
    }

    const end = array[array.length - 1];
    for (let i = array.length - 1; i > 0; i--) {
      array[i] = array[i - 1];
    }
    array[0] = end;
    setCurrentTurn(0);
    setPlayersCards(array);
    setIsPlay(false);
  };

  //Fait passer au joueur suivant
  const nextPlayerTurn = () => {
    let newCurrentTurn = currentTurn + 1;
    setCurrentTurn(newCurrentTurn);
    setIsPlay(false);
  };

  // Renvoie un tableau contenant le tour du joueur et son nom
  const collectPlayers = () => {
    const [playerTurn, setPlayerTurn] = useState([]);

    useEffect(() => {
      const playerGameRef = ref(db, "GamePlayer/" + game + "/");
      const unsubscribe = onValue(playerGameRef, (snapshot) => {
        const players = snapshot.val();
        setPlayers(Object.keys(players));
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
    }, [game]);

    return playerTurn;
  };

  //Récupère les joueurs de la partie et leur tour de jeu
  const playersTurn = collectPlayers();

  useEffect(() => {
    const fetchData = async () => {
      const cardsArray = await cards();
      const cardList = randomCard(cardsArray);
      const newPlayersCards = distributeCards(cardList, playerNumber);
      setPlayersCards(newPlayersCards);
    };
    fetchData();
  }, []);

  const onUpdateDeck = (deck) => {
    setPlayersCards((prevCards) =>
      prevCards.map((playerCards, index) => {
        if (index === currentTurn) {
          return deck;
        }
        return playerCards;
      })
    );
    onUpdatePlay();
  };

  const onUpdatePlay = () => {
    setIsPlay(true);
  };

  // Affiche "Loading..." si les données ne sont pas encore disponibles
  return (
    <ImageBackground
      source={require("../assets/agora.jpeg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <SafeAreaView>
          {playersCards.length > 0 ? (
            <View style={styles.flatListContainer}>
              <PlayerInformations player={playersTurn[currentTurn + 1]} />
              <PlayersCards
                deck={playersCards[currentTurn]}
                player={playersTurn[currentTurn + 1]}
                onUpdateDeck={onUpdateDeck}
                isPlay={isPlay}
              />
              <TouchableOpacity
                style={styles.button}
                title="Next turn"
                onPress={() => setShowDialog(true)}
              >
                <Text style={styles.textButton}>Voir la merveille</Text>
              </TouchableOpacity>
              {isPlay ? (
                <>
                  {currentTurn + 1 !== playerNumber ? (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={nextPlayerTurn}
                      title="next Player"
                    >
                      <Text style={styles.textButton}>Joueur suivant</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={arrayRotation}
                      title="Next turn"
                    >
                      <Text style={styles.textButton}>Tour suivant</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <></>
              )}
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </SafeAreaView>
      </View>
      <Modal visible={showDialog}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              Etapes de construction de la merveille
            </Text>
            <WonderStep
              player={playersTurn[currentTurn + 1]}
              deck={playersCards[currentTurn]}
              onUpdateDeck={onUpdateDeck}
              isPlay={isPlay}
            />
            <TouchableOpacity
              style={[
                styles.button,
                { width: 324, backgroundColor: "#C70039" },
              ]}
              onPress={() => setShowDialog(false)}
            >
              <Text style={styles.textButton}>Fermer la boîte de dialogue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  modalView: {
    width: 350,
    height: 700,
    padding: 10,
    borderRadius: 20,
  },
  modalTitle: {
    padding: 10,
    borderRadius: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#c9aa79",
  },
  background: {
    flex: 1,
    resizeMode: "cover", // Pour couvrir tout l'écran
  },
  container: {
    padding: 2,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatListContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#c9aa79",
    borderRadius: 10,
    padding: 10,
    marginTop: 2,
    margin: 2,
    marginLeft: 10,
  },
  textButton: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Turn;
