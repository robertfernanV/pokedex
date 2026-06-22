import { PokemonListItem } from "@domain/entities/PokemonListItem";
import { selectIsFavorite } from "@presentation/store/favoritesSelectors";
import { toggleFavorite } from "@presentation/store/favoritesThunks";
import { useAppDispatch, useAppSelector } from "@presentation/store/hooks";
import { Image } from "expo-image";
import { createContext, ReactNode, useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Compound Pattern: <PokemonCard> expone subcomponentes
 * (Image, Id, Name, Body, FavoriteButton) que comparten el mismo pokémon
 * vía Context, sin prop-drilling. Cada pantalla compone la card como quiera.
 *
 * Nota: el Context solo transporta el `pokemon` de ESTA card. El estado de
 * negocio (favoritos) sigue viviendo en Redux: FavoriteButton despacha el
 * thunk toggleFavorite y lee selectIsFavorite del store global.
 */
type PokemonCardContextValue = {
  pokemon: PokemonListItem;
};

const PokemonCardContext = createContext<PokemonCardContextValue | null>(null);

function usePokemonCard(): PokemonCardContextValue {
  const context = useContext(PokemonCardContext);
  if (!context) {
    throw new Error(
      "Los subcomponentes de PokemonCard deben usarse dentro de <PokemonCard>",
    );
  }
  return context;
}

type PokemonCardRootProps = {
  pokemon: PokemonListItem;
  onPress?: () => void;
  children: ReactNode;
};

function PokemonCardRoot({ pokemon, onPress, children }: PokemonCardRootProps) {
  return (
    <PokemonCardContext.Provider value={{ pokemon }}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </PokemonCardContext.Provider>
  );
}

// Placeholder borroso para la carga progresiva de la imagen (expo-image).
const BLURHASH = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

function PokemonCardImage() {
  const { pokemon } = usePokemonCard();
  return (
    <Image
      style={styles.image}
      source={{ uri: pokemon.imageUrl }}
      placeholder={{ blurhash: BLURHASH }}
      contentFit="contain"
      transition={300}
      recyclingKey={String(pokemon.id)}
    />
  );
}

function PokemonCardId() {
  const { pokemon } = usePokemonCard();
  return <Text style={styles.id}>#{String(pokemon.id).padStart(3, "0")}</Text>;
}

function PokemonCardName() {
  const { pokemon } = usePokemonCard();
  return <Text style={styles.name}>{pokemon.name}</Text>;
}

/** Contenedor flexible para agrupar piezas de texto (id + nombre, etc.). */
function PokemonCardBody({ children }: { children: ReactNode }) {
  return <View style={styles.body}>{children}</View>;
}

function PokemonCardFavoriteButton() {
  const { pokemon } = usePokemonCard();
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) =>
    selectIsFavorite(state, pokemon.id),
  );

  return (
    <Pressable
      hitSlop={10}
      onPress={() => dispatch(toggleFavorite(pokemon))}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
      }
    >
      <Text style={styles.heart}>{isFavorite ? "❤️" : "🤍"}</Text>
    </Pressable>
  );
}

export const PokemonCard = Object.assign(PokemonCardRoot, {
  Image: PokemonCardImage,
  Id: PokemonCardId,
  Name: PokemonCardName,
  Body: PokemonCardBody,
  FavoriteButton: PokemonCardFavoriteButton,
});

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardPressed: {
    opacity: 0.6,
  },
  image: {
    width: 64,
    height: 64,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  id: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  heart: {
    fontSize: 22,
  },
});
