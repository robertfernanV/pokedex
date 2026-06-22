import { favoritesController } from "@application/di/pokemonDependencies";
import { PokemonListItem } from "@domain/entities/PokemonListItem";
import type { RootState } from "@presentation/store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

/** Carga los favoritos persistidos (funciona sin conexión). */
export const loadFavorites = createAsyncThunk<PokemonListItem[]>(
  "favorites/load",
  async () => {
    return favoritesController.getFavorites();
  },
);

/**
 * Agrega o quita un pokémon de favoritos según su estado actual,
 * y devuelve la colección actualizada ya persistida.
 */
export const toggleFavorite = createAsyncThunk<
  PokemonListItem[],
  PokemonListItem,
  { state: RootState }
>("favorites/toggle", async (pokemon, { getState }) => {
  const alreadyFavorite = getState().favorites.items.some(
    (item) => item.id === pokemon.id,
  );

  if (alreadyFavorite) {
    await favoritesController.removeFavorite(pokemon.id);
  } else {
    await favoritesController.addFavorite(pokemon);
  }

  return favoritesController.getFavorites();
});
