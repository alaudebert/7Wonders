import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "./configuration";
import Wonders from "./Wonders";

const RandomWonder = () => {
  //const charArray = ["CR", "GP", "JB", "MH", "PA", "TA", "ZO"];
  const charArray = ["CR", "PA"];

  const [randomWonder, setRandomWonder] = React.useState(Math.floor(Math.random() * charArray.length));
  const [city, setCity] = React.useState(null);

  const handleGenerateRandomWonder = () => {
    const indexRandomWonder = Math.floor(Math.random() * charArray.length);
    setRandomWonder(charArray[indexRandomWonder]);
    const cityRef = ref(db, `City/${charArray[indexRandomWonder]}`); // Modifier ici pour accéder à la ville aléatoire correctement
    onValue(cityRef, (snapshot) => {
      const cityData = snapshot.val();
      setCity(cityData); // Mettre à jour l'état de la ville avec les données récupérées de Firebase
    });
    console.log(city);
  };

  return (
    <View style={styles.displayWonder}>
      <Text>Random Wonder: {randomWonder}</Text>
      <Button
        title="Generate Random Wonder"
        onPress={handleGenerateRandomWonder}
      />
      <Wonders cityId={randomWonder} city={city} />
    </View>
  );
};

export default RandomWonder;

const styles = StyleSheet.create({
  displayWonder: {
    padding: 100,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
