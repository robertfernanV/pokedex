import { PokemonDetailScreen } from "@presentation/screens/PokemonDetailScreen";
import { useLocalSearchParams } from "expo-router";

export default function PokemonDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PokemonDetailScreen idOrName={id} />;
}
