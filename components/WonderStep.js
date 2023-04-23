import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  get,
  update,
  ref,
  onValue,
} from "firebase/database";
import { db } from "./configuration";
import Wonders from "./Wonders";

const WonderStep = ({ player, onUpdatePlay, isPlay}) => {
  const [wonderId, setWonderId] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [firstIncompleteStep, setFirstIncompleteStep] = useState("");
  const [wonderCost, setWonderCost] = useState({});
  const [wonderSave, setWonderSave] = useState({});
  const [error, setError] = useState("");

  const getPlayerWonder = useCallback(() => {
    const playerWonderRef = ref(db, `PlayerWonder/${player}`);

    onValue(playerWonderRef, (snapshot) => {
      const data = snapshot.val();
      setWonderId(data.Wonder);
    });
  }, [player]);

  const getCityName = useCallback(() => {
    const cityRef = ref(db, `City/${wonderId}`);

    onValue(cityRef, (snapshot) => {
      const data = snapshot.val();
      setCity(data.Name);
      setIsLoading(false);
    });
  }, [wonderId]);

  const getIncompleteStep = useCallback(() => {
    const wonderBuilds = ref(db, `Wonders/${wonderId}/`);
    onValue(wonderBuilds, (snapshot) => {
      const resourceValCost = snapshot.val();
      for (const isBuild in resourceValCost) {
        if (resourceValCost[isBuild].Build == false) {
          setFirstIncompleteStep(isBuild);
          break;
        }
      }
    });
  }, [wonderId]);

  const getResourcesCostAndSave = useCallback(() => {
    const wonderResourcesCostRef = ref(
      db,
      `WonderResourceCost/${wonderId}/${firstIncompleteStep}/`
    );
    onValue(wonderResourcesCostRef, (snapshotCost) => {
      const resourceValCost = snapshotCost.val();
      setWonderCost(resourceValCost);
    });

    const wonderResourcesSaveRef = ref(
      db,
      `WonderResourceSave/${wonderId}/${firstIncompleteStep}/`
    );
    onValue(wonderResourcesSaveRef, (snapshotSave) => {
      const resourceValSave = snapshotSave.val();
      setWonderSave(resourceValSave);
    });
  }, [wonderId, firstIncompleteStep]);

  useEffect(() => {
    getPlayerWonder();
  }, [getPlayerWonder]);

  useEffect(() => {
    if (wonderId) {
      getCityName();
    }
  }, [getCityName, wonderId]);

  useEffect(() => {
    if (wonderId) {
      getIncompleteStep();
    }
  }, [getIncompleteStep, wonderId]);

  useEffect(() => {
    if (firstIncompleteStep) {
      getResourcesCostAndSave();
    }
  }, [getResourcesCostAndSave, firstIncompleteStep]);

  const built = async (listCostResources, listSaveResources) => {
    try {
      for (const cost in listCostResources) {
        const resourcesRef = ref(
          db,
          `PlayerResource
/${player}/${cost}`
        );
        const snapshot = await get(resourcesRef);
        const resourceVal = snapshot.val();
        if (resourceVal.quantity >= listCostResources[cost].Quantity) {
          await update(ref(db, `PlayerResource/${player}/${cost}`), {
            quantity: resourceVal.quantity - listCostResources[cost].Quantity,
          });
          await update(ref(db, `Wonders/${wonderId}/${firstIncompleteStep}`), {
            Build: true,
          });
          console.log(`${cost} delete successfully!`);
        } else {
          throw new Error(
            "Vous n'avez pas assez de " + cost + " pour construire cette étape"
          );
        }
      }

      for (const newResourceSave in listSaveResources) {
        const resourcesRef = ref(
          db,
          `PlayerResource/${player}/${newResourceSave}`
        );
        const snapshot = await get(resourcesRef);
        const resourceVal = snapshot.val();
        await update(ref(db, `PlayerResource/${player}/${newResourceSave}`), {
          quantity:
            resourceVal.quantity + listSaveResources[newResourceSave].Quantity,
        });
        console.log(`${newResourceSave} saved successfully!`);
        onUpdatePlay();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={{
        width: 350,
        height: 550,
        padding: 10,
        borderRadius: 20,
      }}
    >
      <Text style={styles.title}>{city}</Text>
      <Wonders cityId={wonderId} city={city} />
      {error !== "" ? (
        <Text style={styles.error}>{error}</Text>
      ) : firstIncompleteStep != "" ? (
        isPlay == false ? (
        <TouchableOpacity
          style={[styles.button, { width: 320 }]}
          onPress={() => {
            built(wonderCost, wonderSave);
          }}
        >
          <Text style={styles.textButton}>Construire</Text>
        </TouchableOpacity>):(<></>)
      ) : (
        <Text style={styles.wonderBuild}>
          {" "}
          Votre merveille est construite !{" "}
        </Text>
      )}
    </View>
  );
};

export default WonderStep;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    width: "50%",
    backgroundColor: "#c9aa79",
    borderRadius: 10,
    padding: 10,
    marginTop: 2,
    margin: 2,
  },
  textButton: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  error: {
    textAlign: "center",
    backgroundColor: "red",
    color: "white",
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 10,
  },
  wonderBuild: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#4B800F",
    marginVertical: 20,
  },
});
