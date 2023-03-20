import { FlatList } from "react-native";
import Player from "./Player";

const Game = ({ route }) => {
  const numberOfPlayers = route.params.PlayerNumber;

  const players = [];

  for (let i = 1; i <= numberOfPlayers; i++) {
    players.push({ key: i.toString() });
  }

  return (
    <FlatList
      data={players}
      renderItem={({ item }) => <Player key={item.key} />}
    />
  );
};

export default Game;
