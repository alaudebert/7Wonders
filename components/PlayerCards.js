import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ref, get, update } from "firebase/database";
import { db } from "./configuration";
import { globalColor } from "./Global";
import { resourceImage } from "./Global";

/**
 *
 * @param {*}
 * player donne le nom du joueur
 * deck donne le tableau de cartes du joueurs
 * onUpdateDeck est la fonction de callBack pour mettre à jour le tacareesbleau de cartes
 *  isPlay renseigne si le joueur à déjà joué ou pas
 * @returns PlayerCards permet d'afficher les cartes du joueurs et les actions choisir et vendre
 */
const PlayerCards = ({ player, deck, onUpdateDeck, isPlay }) => {
  const [cardColors, setCardColors] = useState({});
  const [cardResourcesCost, setCardResourcesCost] = useState({});
  const [cardResourcesSave, setCardResourcesSave] = useState({});
  const [error, setError] = useState("");
  let errorMessage = "";

  /**
   * Permet au joueur de vendre sa carte et de gagner 3 points de trésors
   * @param {*} item
   */
  const SaleCard = (item) => {
    setError("");
    const resourcesRef = ref(db, `PlayerResource/${player}/Treasure/`);
    get(resourcesRef)
      .then((snapshot) => {
        const resourceVal = snapshot.val();
        update(ref(db, `PlayerResource/${player}/Treasure/`), {
          quantity: resourceVal.quantity + 3,
        })
          .then(() => {
            console.log(`Treasure saved successfully!`);
          })
          .catch((error) => {
            console.error(error);
          });
        onUpdateDeck(deck.filter((card) => card !== item));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * Permet au joueur de choisir une carte, de lui faire gagner les resources correspondantes
   * au gain et perdre celles correspondantes au cout
   * @param {} listCostResources : liste des resources à gagner
   * @param {*} listSaveResources : liste des resources cout
   * @param {*} item
   */
  const addCardToPlayer = async (
    listCostResources,
    listSaveResources,
    item
  ) => {
    setError("");
    for (const cost of listCostResources) {
      const resourcesRef = ref(db, `PlayerResource/${player}/${cost[0]}`);
      const snapshot = await get(resourcesRef);
      const resourceVal = snapshot.val();
      if (resourceVal.quantity >= cost[1].Quantity) {
        update(ref(db, `PlayerResource/${player}/${cost[0]}`), {
          quantity: resourceVal.quantity - cost[1].Quantity,
        })
          .then(() => {
            console.log(`${cost[0]} saved successfully!`);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        errorMessage =
          "Vous n'avez pas assez de " + cost[0] + " pour acheter cette carte";
        setError(errorMessage);
      }
    }
    if (errorMessage == "") {
      for (const newResourceSave of listSaveResources) {
        const resourcesRef = ref(
          db,
          `PlayerResource/${player}/${newResourceSave[0]}`
        );
        const snapshot = await get(resourcesRef);
        const resourceVal = snapshot.val();
        update(ref(db, `PlayerResource/${player}/${newResourceSave[0]}`), {
          quantity: resourceVal.quantity + newResourceSave[1].Quantity,
        })
          .then(() => {
            console.log(`${newResourceSave[0]} saved successfully!`);
          })
          .catch((error) => {
            console.error(error);
          });
      }
      onUpdateDeck(deck.filter((card) => card !== item));
    }
  };

  /**
   * On récupère les tableaux de ressources (gain et cout)
   */
  useEffect(() => {
    const cardColorsRef = {};
    const cardResourcesCostRef = {};
    const cardResourcesSaveRef = {};
    const promises = deck.map((card) => {
      const cardRef = ref(db, "Card/Age 1/" + card + "/");
      return get(cardRef).then((snapshot) => {
        const cardData = snapshot.val();
        cardColorsRef[card] = cardData.Color;

        const cardResourceCostRef = ref(db, "CardResourceCost/" + card + "/");
        return get(cardResourceCostRef).then((snapshot) => {
          const cardResourceCostData = snapshot.val();
          cardResourcesCostRef[card] = cardResourceCostData;

          const cardResourceSaveRef = ref(db, "CardResourceSave/" + card + "/");
          return get(cardResourceSaveRef).then((snapshot) => {
            const cardResourceSaveData = snapshot.val();
            cardResourcesSaveRef[card] = cardResourceSaveData;
          });
        });
      });
    });
    Promise.all(promises).then(() => {
      setCardColors(cardColorsRef);
      setCardResourcesCost(cardResourcesCostRef);
      setCardResourcesSave(cardResourcesSaveRef);
    });
  }, [deck]);

  const renderItem = ({ item }) => {
    const cardColor = globalColor[cardColors[item]];
    const cardResourceCost = cardResourcesCost[item];
    const cardResourceCostList = cardResourceCost
      ? Object.entries(cardResourceCost)
      : [];
    const cardResourceSave = cardResourcesSave[item];
    const cardResourceSaveList = cardResourceSave
      ? Object.entries(cardResourceSave)
      : [];

    return (
      <View style={[styles.card]}>
        <Text
          style={[
            styles.title,
            { textAlign: "center", color: cardColor, flexWrap: "wrap" },
          ]}
        >
          {item}
        </Text>
        <View style={{ flexDirection: "row" }}>
          {cardResourceSaveList.map(([resource, { Quantity }]) => (
            <View key={resource} style={styles.resourceSave}>
              <Image
                source={resourceImage[resource]}
                style={styles.resourceImage}
              />
              <Text> x {Quantity}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text>Coût : </Text>
          {cardResourceCostList.map(([resource, { Quantity }]) => (
            <View key={resource} style={styles.resourceSave}>
              <Image
                source={resourceImage[resource]}
                style={styles.resourceImage}
              />
              <Text>x {Quantity}</Text>
            </View>
          ))}
        </View>
        {isPlay == false ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.button}
              title="Built"
              onPress={() =>
                addCardToPlayer(
                  cardResourceCostList,
                  cardResourceSaveList,
                  item
                )
              }
            >
              <Text style={styles.textButton}>Choisir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              title="Built"
              onPress={() => {
                SaleCard(item);
              }}
            >
              <Text style={styles.textButton}>Vendre</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {error !== "" ? <Text style={styles.error}>{error}</Text> : <></>}
      <View>
        <FlatList
          data={Object.keys(cardColors)}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          horizontal={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  list: {
    flexDirection: "row",
  },
  card: {
    height: 250,
    minWidth: 250,
    backgroundColor: "#FFF",
    flex: 1,
    borderRadius: 10,
    padding: 5,
    margin: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
  resourceSave: {
    flexWrap: "wrap",
    borderRadius: 10,
    margin: 5,
  },
  button: {
    width: "50%",
    backgroundColor: "#c9aa79",
    borderRadius: 10,
    padding: 10,
    marginTop: 2,
    margin: 2,
  },
  textButton: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  resourceImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  error: {
    textAlign: "center",
    backgroundColor: "red",
    color: "white",
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 10,
  },
});

export default PlayerCards;
