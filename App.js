import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import { useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./components/configuration";

export default function App() {
  const [wonderName, setWonderName] = useState("");
  const [wonderStep, setWonderStep] = useState("");
  const [wonderBuild, setWonderBuild] = useState(false);
  const [wonderMail, setWonderMail] = useState("");
  const [wonderResourceName, setWonderResourceName] = useState("");

  function readWonderData() {
    const wonderRef = ref(db, "Wonders/");
    onValue(wonderRef, (snapshot) => {
      const wonders = snapshot.val();
      const wonder = wonders[wonderName];
      if (wonder) {
        setWonderStep(wonder.Step);
        setWonderBuild(wonder.Build);
        setWonderMail(wonder.mail);
        const wonderResourceRef = ref(db, "WonderResource/" + wonderName + "/");
        onValue(wonderResourceRef, (snapshot) => {
          const resource = snapshot.val();
          setWonderResourceName(resource);
        });
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text>Firebase</Text>
      <TextInput
        value={wonderName}
        onChangeText={(name) => {
          setWonderName(name);
        }}
        placeholder="Wonder Name"
        style={styles.textBox}
      />
      <Text>Step: {wonderStep}</Text>
      <Text>Build: {wonderBuild ? "Yes" : "No"}</Text>
      <Text>Resource: {wonderResourceName}</Text>
      <Button onPress={readWonderData} title="Submit" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
    width: "90%",
    fontSize: 18,
    padding: 12,
    borderColor: "gray",
    borderWidth: 0.2,
    borderRadius: 10,
  },
});
