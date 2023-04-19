import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "./configuration";
import Wonders from "./Wonders";
import { wonderImage, resourceImage } from "./Global";
import { cities } from "./Global.js";

/**
 * Au clic randomWonder associe une merveille aléatoire à un joueur
 * Utilise 2 fonctions de callback avec onWonderChange et onResourceChange
 * Contient le composant Wonder qui affiche les informations de la merveille
 * @param {*} param0 
 * @returns 
 */
const RandomWonder = ({ onWonderChange, onResourceChange}) => {
  const image = require("../assets/add.png");

  /** Permet de gérer l'autorisation de clic sur la génération d'une merveille */
  const [disabled, setDisabled] = useState(false);
  /** Resource associée à la merveille */
  const [resource, setResource] = useState(null);
  /** Id de merveille aléatoire */
  const [randomWonder, setRandomWonder] = React.useState("");
  /** Merveille */
  const [city, setCity] = React.useState(null);

  /** Permet d'attendre que la merveille soit récupérée avant de l'afficher  */
  const [loadingCity, setLoadingCity] = React.useState(false);

  /**
   * Selection d'une merveille aléatoire et 
   * Suppression de cette merveille pour qu'elle ne tombe qu'une fois
   */
  const handleGenerateRandomWonder = () => {
    if (!loadingCity) {
      const indexRandomWonder = Math.floor(Math.random() * cities.length);
      const newRandomWonder = cities[indexRandomWonder];
      setRandomWonder(newRandomWonder);
      cities.splice(indexRandomWonder, 1);
    }
  };

  /** Récupération de la merveille et de sa merveille */
  useEffect(() => {
    if (randomWonder !== "") {
      setLoadingCity(true);
      const cityRef = ref(db, `City/${randomWonder}`);
      onValue(cityRef, (snapshot) => {
        const cityData = snapshot.val();
        setCity(cityData);
        setLoadingCity(false);
      });
      //La merveille aléatoire ne peut être chargé qu'une fois
      setDisabled(true);

      //Récupération de la ressource de la merveille
      const cityResourceRef = ref(db, "CityResource/" + randomWonder + "/");
      onValue(cityResourceRef, (snapshot) => {
        const CityResource = snapshot.val();
        setResource(CityResource.Resource);
        handleResourceChange(CityResource.Resource);
      });
    }
    handleWonderChange();
  }, [randomWonder]);

  /** Fonction de callback pour faire remonter la resource de la merveille au composant player */
  const handleResourceChange = (resource) => {
    onResourceChange(resource);
  };

  /** Fonction de callback permettant de faire remonter la merveille au composant Player */
  const handleWonderChange = () => {
    onWonderChange(randomWonder);
  };

  return (
    <View>
      <View style={styles.wonders}>
        <TouchableOpacity
          onPress={handleGenerateRandomWonder}
          disabled={disabled}
        >
          {!disabled ? (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Image source={image} style={styles.image} />
              <Text style={{ maxWidth: "80%", position: "relative", top: 30 }}>
                Cliquez sur + pour découvrir votre merveille !
              </Text>
            </View>
          ) : (
            <View>
              <Image source={wonderImage[randomWonder]} style={styles.image} />
              <Image source={resourceImage[resource]} style={styles.resource} />
            </View>
          )}
        </TouchableOpacity>

        {city && <Text style={styles.wonderName}>{city.Name}</Text>}
      </View>
      {loadingCity ? (
        <Text>Chargement de la merveille...</Text>
      ) : (
        <View>
          <Wonders cityId={randomWonder} city={city} />
        </View>
      )}
    </View>
  );
};

export default RandomWonder;

const styles = StyleSheet.create({
  image: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  load: {
    position: "relative",
    top: 5,
    padding: 30,
  },
  wonders: {
    flex: 1,
    flexDirection: "row",
  },
  wonderName: {
    padding: 30,
    textAlign: "center",
    fontSize: 18,
  },
  resource: {
    position: "relative",
    top: -30,
    left: 60,
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
