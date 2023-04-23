import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { ref, set, update, onValue, remove } from "firebase/database";
import { db } from "../components/configuration";

/** Page d'accueil de l'application
 *
 * Fonctionnalitées :
 *  - Créer une partie avec son nom de partie et son nombre de joueur
 *
 * Navigation :
 *  - Renvoie à la page Game.js
 */
const Home = (props) => {
  /** @constante @type {string} Enregistre le nom de la partie  */
  const [name, setName] = useState("");

  /** @constante @type {number} Enregistre le nombre de joueurs (minimum 4)*/
  const [numberOfPlayers, setNumberOfPlayers] = useState(4);

  /** Gestion de la navigation
   * @returns Donne le nom de la partie et le nombre de joueur en paramètre de la navigation
   */
  const goTo = () => {
    props.navigation.push("Game", {
      PlayerNumber: numberOfPlayers,
      Name: name,
    });
  };

  /**
   * Ajoute la partie dans la base de donnée en utilisant le nom entrée
   * @returns Appel la constante goTo qui gère la navigation
   */
  function createData() {
    set(ref(db, "Game/" + name), {
      name: name,
      players: numberOfPlayers,
    })
      .then(() => {
        // Data saved successfully!
        alert("data updated!");
      })
      .catch((error) => {
        // The write failed...
        alert(error);
      });
    goTo();
  }

  /** Vérifie qu'un nom de partie est entrée avant de créer la partie et passer à la suite */
  const verification = () => {
    if (!name) {
      alert("Veuillez indiquer un nom de partie ! ");
      return;
    } else {
      createData();
    }
  };

  return (
    <ImageBackground
      source={require("../assets/couverture.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require(`../assets/titre.png`)} style={styles.image} />

        <TextInput
          value={name}
          onChangeText={(name) => {
            setName(name);
          }}
          placeholder="Nom de la partie"
          style={styles.textBoxes}
        ></TextInput>

        <View style={styles.textBoxes}>
          <Picker
            selectedValue={numberOfPlayers}
            onValueChange={(itemValue) => setNumberOfPlayers(itemValue)}
            style={styles.picker}
          >
            <Picker.Item style={styles.picker} label="4 joueurs" value="4" />
            <Picker.Item label="5 joueurs" value="5" />
            <Picker.Item label="6 joueurs" value="6" />
            <Picker.Item label="7 joueurs" value="7" />
          </Picker>
        </View>

        <TouchableOpacity
          onPress={() => {
            verification();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Jouer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textBoxes: {
    width: "90%",
    fontSize: 18,
    padding: 12,
    borderColor: "gray",
    borderWidth: 0.4,
    borderRadius: 10,
    margin: 20,
    backgroundColor: "#fff",
  },
  text: {
    textAlign: "center",
    width: "63%",
    fontSize: 18,
    padding: 12,
    borderColor: "#c9aa79",
    borderWidth: 0.2,
    borderRadius: 10,
    marginBottom: 40,
    marginLeft: 20,
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
    resizeMode: "cover", // Pour couvrir tout l'écran
  },
  image: {
    width: 350,
    height: 200,
    resizeMode: "contain",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin: 40,
    backgroundColor: "#c9aa79",
    borderRadius: 8,
    shadowColor: "#fff",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  number: {
    width: "90%",
    flexDirection: "row",
  },
});
