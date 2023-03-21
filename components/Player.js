import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { ref, set, update, onValue, remove } from "firebase/database";
import RandomWonder from "./displayWonders";
import { db } from "./configuration";
import { resource } from "./displayWonders";

const Player = (props) => {
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
  const gameName = props.game;
  const turn = props.turn;

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
        alert("data updated!");
      })
      .catch((error) => {
        alert(error);
      });

    update(ref(db, "GamePlayer/" + gameName), {
      [username]: {
        Turn: turn,
      },
    })
      .then(() => {
        alert("data updated!");
      })
      .catch((error) => {
        alert(error);
      });

    const savePlayerResources = (username) => {
      const resourcesRef = ref(db, "Resource/");

      onValue(resourcesRef, (snapshot) => {
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
        {username ? (
          <RandomWonder
            onWonderChange={handleWonderChange}
            onResourceChange={handleResourceChange}
            player={username}
          />
        ) : (
          <></>
        )}
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
  title: {
    fontSize: 40,
    padding: 20,
    fontWeight: "bold",
    color: "#107657",
  },
  player: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  textBoxes: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    width: "90%",
    fontSize: 18,
    padding: 12,
    borderColor: "#c9aa79",
    borderWidth: 1,
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
    backgroundColor: "#c9aa79",
    borderRadius: 20,
    padding: 8,
  },
  textButton: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
