import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import { useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./configuration";

const Wonder = () => {
  const [cityId, setCityId] = useState("");
  const [cityName, setCityName] = useState("");
  const [wonderBuilds, setWonderBuilds] = useState({});
  const [wonderResources, setWonderResources] = useState({});
  const [wonderResourceName, setWonderResourceName] = useState("");

  function readWonderData() {
    const cityRef = ref(db, "City/");
    onValue(cityRef, (snapshot) => {
      const cities = snapshot.val();
      const city = cities[cityId];
      if (city) {
        setCityName(city.Name);
        const wonderRef = ref(db, "Wonders/" + cityId + "/");
        onValue(wonderRef, (snapshot) => {
          const builds = snapshot.val();
          let buildObj = {};
          for (const [buildNum, build] of Object.entries(builds)) {
            buildObj[buildNum] = build.Build;
          }
          setWonderBuilds(buildObj);
        });
        const wonderResourceRef = ref(db, "WonderResource/" + cityId + "/");
        onValue(wonderResourceRef, (snapshot) => {
          const resources = snapshot.val();
          let resourcedObj = {};
          for (const [resourceNum, resource] of Object.entries(resources)) {
            resourcedObj[resourceNum] = resource.Name;
          }
          setWonderResources(resourcedObj);
        });
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text>Firebase</Text>
      <TextInput
        value={cityId}
        onChangeText={(name) => {
          setCityId(name);
        }}
        placeholder="Wonder Name"
        style={styles.textBox}
      />
      <Text>Resource: {cityName}</Text>
      {Object.keys(wonderBuilds).map((buildNum) => (
        <View key={buildNum}>
          <Text>
            Construction de l'étape {buildNum}:{" "}
            {wonderBuilds[buildNum] ? "Oui" : "Non"}
          </Text>
          <Text key={buildNum}>Resource : {wonderResources[buildNum]}</Text>
        </View>
      ))}

      <Button onPress={readWonderData} title="Submit" />
    </View>
  );
};

export default Wonder;

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
