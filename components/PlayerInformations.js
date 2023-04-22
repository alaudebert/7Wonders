import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "./configuration";
import { resourceImage } from "./Global";

const PlayerInformation = ({ player }) => {
  const [resources, setResources] = useState([]);

  //On récupère dans resources le nom de chaque ressource associée à sa quantité
  useEffect(() => {
    const playerResourceRef = ref(db, `PlayerResource/${player}`);

    const modify = onValue(playerResourceRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const resources = Object.entries(data).map(([key, value]) => ({
          resource: key,
          quantity: value.quantity,
        }));

        setResources(resources);
      } else {
        setResources([]);
      }
    });

    return () => {
      modify();
    };
  }, [player]);

  //Filtre pour afficher les ressources par colonne
  const FIRST_COLUMN_RESOURCES = ["Army", "Treasure", "Win"]; // Resource permettant de gagner la partie
  const SECOND_COLUMN_RESOURCES = ["Tissus", "Glass", "Paper"]; // Resource riche
  const THIRD_COLUMN_RESOURCES = ["Clay", "Stone", "Ore", "Wood"]; // Resources pauvres

  //Affichage de chaque element de la flatlist
  const renderResource = ({ item }) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image source={resourceImage[item.resource]} style={styles.image} />
      <Text>x {item.quantity}</Text>
    </View>
  );

  /**
   * Composant qui renvoie une FlatList filtrée par un tableau de ressources.
   *
   * @param {Array} data Les données pour la FlatList.
   * @param {Array} filter Le tableau des ressources à filtrer.
   * @returns Un element View contenant une flatlist.
   */
  const ResourceList = ({ data, filter }) => {
    return (
      <View style={styles.column}>
        <FlatList
          data={data.filter((r) => filter.includes(r.resource))}
          renderItem={renderResource}
          keyExtractor={(item) => item.resource}
        />
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.title}>
      {player} 
      </Text>
      <View style={styles.container}>
        <ResourceList data={resources} filter={FIRST_COLUMN_RESOURCES} />
        <ResourceList data={resources} filter={SECOND_COLUMN_RESOURCES} />
        <ResourceList data={resources} filter={THIRD_COLUMN_RESOURCES} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    backgroundColor:'#c9aa79',
    borderRadius: 20,
    padding:5,
  },
  image: {
    width: 40,
    height: 40,
    margin:5,
    borderRadius: 50,
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "90%",
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    margin: 5,
  },
  column: {
    flex: 1,
  },
});

export default PlayerInformation;
