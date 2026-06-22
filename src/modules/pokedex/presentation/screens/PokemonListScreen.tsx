import { PokemonCard } from "@presentation/components/PokemonCard";
import { PokemonListSkeleton } from "@presentation/components/PokemonListSkeleton";
import { SearchBar } from "@presentation/components/SearchBar";
import { StateMessage } from "@presentation/components/StateMessage";
import { setQuery } from "@presentation/store/filterSlice";
import { useAppDispatch, useAppSelector } from "@presentation/store/hooks";
import {
  selectFilteredPokemons,
  selectPokedexError,
  selectPokedexHasMore,
  selectPokedexIsOffline,
  selectPokedexStatus,
} from "@presentation/store/pokedexSelectors";
import {
  loadMorePokemons,
  loadPokemons,
} from "@presentation/store/pokedexThunks";
import { useRouter, type Href } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function PokemonListScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const pokemons = useAppSelector(selectFilteredPokemons);
  const status = useAppSelector(selectPokedexStatus);
  const error = useAppSelector(selectPokedexError);
  const isOffline = useAppSelector(selectPokedexIsOffline);
  const hasMore = useAppSelector(selectPokedexHasMore);
  const query = useAppSelector((state) => state.filter.query);

  useEffect(() => {
    dispatch(loadPokemons());
  }, [dispatch]);

  const handleEndReached = () => {
    // Solo paginamos cuando no hay filtro activo (el filtro opera sobre lo ya cargado).
    if (!query && hasMore && status !== "loadingMore") {
      dispatch(loadMorePokemons());
    }
  };

  const renderEmpty = () => {
    if (status === "loading") {
      return <PokemonListSkeleton />;
    }
    if (status === "failed") {
      return (
        <StateMessage
          emoji="📡"
          title="No se pudo cargar la Pokédex"
          message={error ?? "Revisa tu conexión e inténtalo de nuevo."}
          actionLabel="Reintentar"
          onAction={() => dispatch(loadPokemons())}
        />
      );
    }
    if (query) {
      return (
        <StateMessage
          emoji="🔍"
          title="Sin resultados"
          message={`No encontramos pokémon que coincidan con "${query}".`}
        />
      );
    }
    return <StateMessage emoji="📭" title="La lista está vacía" />;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.heading}>Pokédex</Text>

      <SearchBar
        value={query}
        onChangeText={(text) => dispatch(setQuery(text))}
      />

      {isOffline ? (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            Sin conexión · mostrando la última lista guardada
          </Text>
        </View>
      ) : null}

      <FlatList
        data={pokemons}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={
          pokemons.length === 0 ? styles.emptyContent : styles.listContent
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
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          status === "loadingMore" ? (
            <ActivityIndicator style={styles.footer} />
          ) : null
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
  },
  offlineBanner: {
    backgroundColor: "#fff3cd",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  offlineText: {
    color: "#856404",
    fontSize: 12,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  emptyContent: {
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 16,
  },
});
