import { PokemonCard } from "@presentation/components/PokemonCard";
import { StateMessage } from "@presentation/components/StateMessage";
import { selectFavorites } from "@presentation/store/favoritesSelectors";
import { loadFavorites } from "@presentation/store/favoritesThunks";
import { useAppDispatch, useAppSelector } from "@presentation/store/hooks";
import { useRouter, type Href } from "expo-router";
import { useEffect } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function FavoritesScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const favorites = useAppSelector(selectFavorites);

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.heading}>Favoritos</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={
          favorites.length === 0 ? styles.emptyContent : styles.listContent
        }
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={() => router.push(`/pokemon/${item.id}` as Href)}
          >
            <PokemonCard.Image />
            <PokemonCard.Body>
              <PokemonCard.Id />
              <PokemonCard.Name />
            </PokemonCard.Body>
            <PokemonCard.FavoriteButton />
          </PokemonCard>
        )}
        ListEmptyComponent={
          <StateMessage
            emoji="💛"
            title="Aún no tienes favoritos"
            message="Toca el corazón de cualquier pokémon para guardarlo aquí."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  emptyContent: {
    flexGrow: 1,
  },
});
