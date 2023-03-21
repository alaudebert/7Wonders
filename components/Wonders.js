import { StyleSheet, Text, View, Image } from "react-native";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./configuration";
import { wonderImage } from "./Global";

const Wonders = (props) => {
  const [wonderBuilds, setWonderBuilds] = useState({});
  const [wonderSaveResources, setWonderSaveResources] = useState({});
  const [wonderSaveQuantities, setWonderSaveQuantities] = useState({});
  const [wonderCostResources, setWonderCostResources] = useState({});
  const [wonderCostQuantities, setWonderCostQuantities] = useState({});
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
        let costResourceObj = {};
        let costQuantitydObj = {};
        for (const [resourceNum, resource] of Object.entries(resources)) {
          const resourceKeys = Object.keys(resource);
          let resourceStr = [];
          let quantityStr = [];
          for (const key of resourceKeys) {
            const quantity = resource[key].Quantity;

            resourceStr.push(key);
            quantityStr.push(quantity);
          }
          costResourceObj[resourceNum] = resourceStr;
          costQuantitydObj[resourceNum] = quantityStr;
        }
        setWonderCostResources(costResourceObj);
        setWonderCostQuantities(costQuantitydObj);
      });

      const wonderSaveResourceRef = ref(
        db,
        "WonderResourceSave/" + cityId + "/"
      );
      onValue(wonderSaveResourceRef, (snapshot) => {
        const resources = snapshot.val();

        let saveResourcedObj = {};
        let saveQuantityObj = {};
        for (const [resourceNum, resource] of Object.entries(resources)) {
          const resourceKeys = Object.keys(resource);
          let resourceStr = [];
          let quantityStr = [];
          for (const key of resourceKeys) {
            const quantity = resource[key].Quantity;
            resourceStr.push(key);
            quantityStr.push(quantity);
          }
          saveResourcedObj[resourceNum] = resourceStr;
          saveQuantityObj[resourceNum] = quantityStr;
        }
        setWonderSaveResources(saveResourcedObj);
        setWonderSaveQuantities(saveQuantityObj);
      });
    }
  }, [props.cityId]);

  return (
    <View style={styles.container}>
      {Object.keys(wonderBuilds).map((buildNum) => (
        <View style={styles.buildContainer} key={buildNum}>
          <Text style={styles.buildEtape}>
            <Text style={{fontWeight:'bold', fontSize:18}}>Etape {buildNum}:{" "}</Text>
            {wonderBuilds[buildNum] ? "  Construite" : "  A construire"}
          </Text>
          <View style={styles.etapeContainer}>
            <View key={buildNum} style={styles.etape}>
              <View style={styles.resourceContainer}>
                {wonderCostResources[buildNum] &&
                  wonderCostQuantities[buildNum] &&
                  wonderCostResources[buildNum].map((resource, index) => (
                    <View key={index}>
                      <Image
                        source={wonderImage[resource]}
                        style={styles.resourceImage}
                      />
                      <Text> x {wonderCostQuantities[buildNum][index]}</Text>
                    </View>
                  ))}
              </View>
              <View style={styles.resourceContainer}>
                {wonderSaveResources[buildNum] &&
                  wonderSaveQuantities[buildNum] &&
                  wonderSaveResources[buildNum].map((resource, index) => (
                    <View key={index}>
                      <Image
                        source={wonderImage[resource]}
                        style={styles.resourceImage}
                      />
                      <Text> x {wonderSaveQuantities[buildNum][index]}</Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Wonders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buildContainer:{
    position:'relative',
    Left:10,
    borderRadius: 20,
    backgroundColor:'#E5E9E2',
paddingBottom:20,
paddingLeft:20,
    marginBottom:10,
  },
  resourceContainer: {
    flex: 1,
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",
  },
  etape: {
    flex: 1,
    flexDirection: "row",
  },
  buildEtape:{
    padding: 10,
    textAlign:'center',
    fontSize: 15,
  },
  image: {
    position: "relative",
    top: -30,
    left: 60,
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,
  },
  resourceImage: {
    width: 40,
    height: 40,
    backgroundColor: "#ECEBEB",
    borderRadius: 10,
  },
});
