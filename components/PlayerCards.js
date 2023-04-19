import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { ref, get, update, onValue, remove } from "firebase/database";
import { db } from "./configuration";
import { globalColor } from "./Global";
import { resourceImage } from "./Global";

const PlayerCards = (props) => {
  const deck = props.deck;
  const [cardColors, setCardColors] = useState({});
  const [cardResourcesCost, setCardResourcesCost] = useState({});
  const [cardResourcesSave, setCardResourcesSave] = useState({});

  useEffect(() => {
    const cardColorsRef = {};
    const cardResourcesCostRef = {};
    const cardResourcesSaveRef = {};

    deck.forEach((card) => {
      const cardRef = ref(db, "Card/Age 1/" + card + "/");
      onValue(cardRef, (snapshot) => {
        const cardData = snapshot.val();
        cardColorsRef[card] = cardData.Color;
        setCardColors(cardColorsRef);

        const cardResourceCostRef = ref(db, "CardResourceCost/" + card + "/");
        onValue(cardResourceCostRef, (snapshot) => {
          const cardResourceCostData = snapshot.val();
          cardResourcesCostRef[card] = cardResourceCostData;
          setCardResourcesCost(cardResourcesCostRef);
        });

        const cardResourceSaveRef = ref(db, "CardResourceSave/" + card + "/");
        onValue(cardResourceSaveRef, (snapshot) => {
          const cardResourceSaveData = snapshot.val();
          cardResourcesSaveRef[card] = cardResourceSaveData;
          setCardResourcesSave(cardResourcesSaveRef);
        });
      });
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
        <View style={styles.cardContent}>
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
          <Text>Contre</Text>

          <View style={{ flexDirection: "row" }}>
            {cardResourceCostList.map(([resource, { Quantity }]) => (
              <View key={resource} style={styles.resourceCost}>
                <Image
                  source={resourceImage[resource]}
                  style={styles.resourceImage}
                />
                <Text>x {Quantity}</Text>
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.button} title="Built">
          <Text style={styles.textButton}>Choisir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView horizontal={true}>
      <FlatList
        data={Object.keys(cardColors)}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 24,
    margin: 8,
  },
  list: {
    flexDirection: "row",
  },
  card: {
    backgroundColor: "#FFF",
    flex: 1,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    justifyContent: "space-between",
  },
  cardContent: {
    justifyContent: "center",
  },
  resourceSave: {
    flexWrap: "wrap",
    borderRadius: 10,
    padding: 4,
    margin: 20,
  },
  resourceCost: {
    flexWrap: "wrap",
    borderRadius: 10,
    padding: 4,
    margin: 2,
    backgroundColor:"#D79F8E",
  },
  button: {
    width: "100%",
    backgroundColor: "#c9aa79",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
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
});

export default PlayerCards;
