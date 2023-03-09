import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import { useState } from "react";
import { ref, onValue, useEffect } from "firebase/database";
import { db } from "./configuration";

const Player = () => {
  const [username, setName] = useState("");
  const [curentDeck, setCurentDeck] = useState("");
  const [cointPoint, setCointPoint] = useState(0);
  const [culturePoint, setCulturePoint] = useState(0);
  const [armyPoint, setArmyPoint] = useState(0);
  const [leftTrade, setLeftTrade] = useState(false);
  const [rightTrade, setRightTrade] = useState(false);
  const [resourceName, setresourceName] = useState("");

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
          set(ref(db, `PlayerResource/${username}/${resourceName}`), {
            quantity: 0,
          })
            .then(() => {
              console.log(`${resourceName} saved successfully!`);
            })
            .catch((error) => {
              console.error(error);
            });
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

  function readDataResource() {}

  return (
    <View style={styles.container}>
      <TextInput
        value={username}
        onChangeText={(username) => {
          setName(username);
        }}
        placeholder="Username"
        style={styles.textBoxes}
      ></TextInput>
      <View style={styles.card}>
        <Text>Point de victoire : </Text>
        <Text>Point de militaire : </Text>
        <Text>Trésor : </Text>
      </View>
      <Button onPress={createData} title="Submit" />
    </View>
  );
};

export default Player;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textBoxes: {
    width: "90%",
    fontSize: 18,
    padding: 12,
    borderColor: "gray",
    borderWidth: 0.2,
    borderRadius: 10,
  },
  card: {
    alignItems: "left",
    justifyContent: "center",
  },
});
