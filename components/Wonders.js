import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./configuration";

const Wonders = (props) => {
  const [wonderBuilds, setWonderBuilds] = useState({});
  const [wonderSaveResources, setWonderSaveResources] = useState({});
  const [wonderCostResources, setWonderCostResources] = useState({});
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    if (props.city) {
      const cityId = props.cityId;
      setCityName(props.city.Name);
      const wonderRef = ref(db, "Wonders/" + cityId + "/");
      onValue(wonderRef, (snapshot) => {
        const builds = snapshot.val();
        let buildObj = {};
        for (const [buildNum, build] of Object.entries(builds)) {
          buildObj[buildNum] = build.Build;
        }
        setWonderBuilds(buildObj);
      });
      const wonderCostResourceRef = ref(
        db,
        "WonderResourceCost/" + cityId + "/"
      );
      onValue(wonderCostResourceRef, (snapshot) => {
        const resources = snapshot.val();

        let costResourcedObj = {};
        for (const [resourceNum, resource] of Object.entries(resources)) {
          const resourceKeys = Object.keys(resource);
          let resourceStr = "";
          for (const key of resourceKeys) {
            const quantity = resource[key].Quantity;
            if (resourceStr === "") {
              resourceStr += `${key} (${quantity})`;
            } else {
              resourceStr += `, ${key} (${quantity})`;
            }
          }
          costResourcedObj[resourceNum] = resourceStr;
        }
        setWonderCostResources(costResourcedObj);
      });

      const wonderSaveResourceRef = ref(
        db,
        "WonderResourceSave/" + cityId + "/"
      );
      onValue(wonderSaveResourceRef, (snapshot) => {
        const resources = snapshot.val();

        let saveResourcedObj = {};
        for (const [resourceNum, resource] of Object.entries(resources)) {
          const resourceKeys = Object.keys(resource);
          let resourceStr = "";
          for (const key of resourceKeys) {
            const quantity = resource[key].Quantity;
            if (resourceStr === "") {
              resourceStr += `${key} (${quantity})`;
            } else {
              resourceStr += `, ${key} (${quantity})`;
            }
          }
          saveResourcedObj[resourceNum] = resourceStr;
        }
        setWonderSaveResources(saveResourcedObj);
      });
    }
  }, [props.cityId]);

  return (
    <View style={styles.container}>
      <Text>Firebase</Text>
      <Text>Merveille : {cityName}</Text>
      {Object.keys(wonderBuilds).map((buildNum) => (
        <View key={buildNum}>
          <Text>
            Construction de l'étape {buildNum}:{" "}
            {wonderBuilds[buildNum] ? "Oui" : "Non"}
          </Text>
          <Text key={buildNum}>
            Cout de l'étape : {wonderCostResources[buildNum]}
            Gain de l'étape : {wonderSaveResources[buildNum]}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default Wonders;

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
