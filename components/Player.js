import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { ref, set, update, onValue, remove } from "firebase/database";
import RandomWonder from "./displayWonders";
import { db } from "./configuration";
import { resource } from "./displayWonders";

const Player = ({ route }) => {
  const [username, setName] = useState("");
  const [curentDeck, setCurentDeck] = useState("");
  const [cointPoint, setCointPoint] = useState(0);
  const [culturePoint, setCulturePoint] = useState(0);
  const [armyPoint, setArmyPoint] = useState(0);
  const [leftTrade, setLeftTrade] = useState(false);
  const [rightTrade, setRightTrade] = useState(false);
  const [resourceName, setResourceName] = useState("");
  const [resource, setResource] = useState("");
  const [city, setCity] = useState("");

  const handleResourceChange = (resource) => {
    setResource(resource);
  };

  const handleWonderChange = (city) => {
    setCity(city);
    set(ref(db, `PlayerWonder/${username}/`), {
      Wonder: city,
    })
      .then(() => {
        console.log(`${city} saved successfully!`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function createData() {
    set(ref(db, "users/" + username), {
      username: username,
      cointPoint: cointPoint,
      culturePoint: culturePoint,
      armyPoint: armyPoint,
      leftTrade: leftTrade,
      rightTrade: rightTrade,
    })
      .then(() => {
        // Data saved successfully!
        alert("data updated!");
      })
      .catch((error) => {
        // The write failed...
        alert(error);
      });

    const savePlayerResources = (username) => {
      const resourcesRef = ref(db, "Resource/");

      onValue(resourcesRef, (snapshot) => {
        // Utilisez la fonction forEach() pour itérer sur tous les champs du document
        snapshot.forEach((childSnapshot) => {
          const resourceName = childSnapshot.child("Name").val();
          if (resourceName == resource) {
            set(ref(db, `PlayerResource/${username}/${resourceName}`), {
              quantity: 1,
            }).catch((error) => {
              console.error(error);
            });
          } else {
            set(ref(db, `PlayerResource/${username}/${resourceName}`), {
              quantity: 0,
            }).catch((error) => {
              console.error(error);
            });
          }
        });
      });
    };

    savePlayerResources(username);
  }

  function updateData() {
    // const newKey = push(child(ref(database), 'users')).key;

    update(ref(db, "users/" + username), {
      username: username,
    })
      .then(() => {
        // Data saved successfully!
        alert("data updated!");
      })
      .catch((error) => {
        // The write failed...
        alert(error);
      });
  }

  const verification = () => {
    if (!username) {
      alert("Veuillez indiquer un nom d'utilisateur");
      return;
    } else if (!city) {
      alert("Veuillez cliquer sur le bouton + pour voir votre merveille");
    } else {
      createData();
    }
  };

  return (
    <View style={styles.player}>
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <TextInput
            required
            value={username}
            onChangeText={(username) => {
              setName(username);
            }}
            placeholder="Nom d'utilisateur"
            style={styles.textBoxes}
          ></TextInput>
        </View>

        <RandomWonder
          onWonderChange={handleWonderChange}
          onResourceChange={handleResourceChange}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={verification}
          title="Valider"
        >
          <Text style={styles.textButton}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Player;

const styles = StyleSheet.create({
  player: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  textBoxes: {
    marginBottom: 20,
    marginTop: 20,
    width: "90%",
    fontSize: 18,
    padding: 12,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 10,
    borderRadius: 20,
    elevation: 5,
  },
  button: {
    width: "100%",
    backgroundColor: "#107657",
    borderRadius: 20,
  },
  textButton: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
