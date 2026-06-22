import { pokemonListController } from "@application/di/pokemonDependencies";
import { PokemonListItem } from "@domain/entities/PokemonListItem";
import type { RootState } from "@presentation/store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const PAGE_SIZE = 20;

export type PokedexPagePayload = {
  items: PokemonListItem[];
  nextOffset: number | null;
  total: number;
  offline: boolean;
};

/**
 * Carga la primera página desde la API. Si la red falla, intenta servir
 * la última lista cacheada (modo offline). Solo rechaza si tampoco hay caché.
 */
export const loadPokemons = createAsyncThunk<
  PokedexPagePayload,
  void,
  { rejectValue: string }
>("pokedex/load", async (_, { rejectWithValue }) => {
  try {
    const page = await pokemonListController.getPokemons(PAGE_SIZE, 0);
    await pokemonListController.savePokemons(page.items);

    return {
      items: page.items,
      nextOffset: page.nextOffset,
      total: page.total,
      offline: false,
    };
  } catch {
    const cached = await pokemonListController.getCachedPokemons();

    if (cached.length > 0) {
      return {
        items: cached,
        nextOffset: null,
        total: cached.length,
        offline: true,
      };
    }

    return rejectWithValue(
      "No se pudo cargar la Pokédex. Revisa tu conexión a internet.",
    );
  }
});

/** Carga la siguiente página y la añade a la lista (infinite scroll). */
export const loadMorePokemons = createAsyncThunk<
  PokedexPagePayload,
  void,
  { state: RootState; rejectValue: string }
>("pokedex/loadMore", async (_, { getState, rejectWithValue }) => {
  const { nextOffset, items } = getState().pokedex;

  if (nextOffset === null) {
    return rejectWithValue("no-more");
  }

  try {
    const page = await pokemonListController.getPokemons(PAGE_SIZE, nextOffset);
    await pokemonListController.savePokemons([...items, ...page.items]);

    return {
      items: page.items,
      nextOffset: page.nextOffset,
      total: page.total,
      offline: false,
    };
  } catch {
    return rejectWithValue("No se pudieron cargar más pokémon.");
  }
}, {
  // Evita peticiones concurrentes: onEndReached puede dispararse varias veces
  // seguidas antes de que el estado pase a "loadingMore".
  condition: (_, { getState }) => {
    const { status, nextOffset } = getState().pokedex;
    if (status === "loading" || status === "loadingMore") {
      return false;
    }
    if (nextOffset === null) {
      return false;
    }
    return true;
  },
});
