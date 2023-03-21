import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "./configuration";
import Wonders from "./Wonders";
import { wonderImage } from "./Global";
import { cities } from "./Global.js";

const RandomWonder = ({ onWonderChange, onResourceChange }) => {
  const image = require("../assets/add.png");

  const [disabled, setDisabled] = useState(false);
  const [resource, setResource] = useState(null);
  const [randomWonder, setRandomWonder] = React.useState("");
  const [city, setCity] = React.useState(null);
  const [loadingCity, setLoadingCity] = React.useState(false);

  const handleGenerateRandomWonder = () => {
    if (!loadingCity) {
      const indexRandomWonder = Math.floor(Math.random() * cities.length);
      const newRandomWonder = cities[indexRandomWonder];
      setRandomWonder(newRandomWonder);
      cities.splice(indexRandomWonder, 1);
    }
  };

  useEffect(() => {
    if (randomWonder !== "") {
      setLoadingCity(true);
      const cityRef = ref(db, `City/${randomWonder}`);
      onValue(cityRef, (snapshot) => {
        const cityData = snapshot.val();
        setCity(cityData);
        setLoadingCity(false);
      });
      setDisabled(true);

      //Récupération des ressources de la merveille
      const cityResourceRef = ref(db, "CityResource/" + randomWonder + "/");
      onValue(cityResourceRef, (snapshot) => {
        const CityResource = snapshot.val();
        setResource(CityResource.Resource);
        handleResourceChange(CityResource.Resource);
      });
    }
    handleWonderChange();
  }, [randomWonder]);

  const handleResourceChange = (resource) => {
    onResourceChange(resource);
  };

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
              <Image source={wonderImage[resource]} style={styles.resource} />
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
