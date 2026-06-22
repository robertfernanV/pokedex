import type { RootState } from "@presentation/store/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectPokedexItems = (state: RootState) => state.pokedex.items;
export const selectPokedexStatus = (state: RootState) => state.pokedex.status;
export const selectPokedexError = (state: RootState) => state.pokedex.error;
export const selectPokedexIsOffline = (state: RootState) =>
  state.pokedex.isOffline;
export const selectPokedexHasMore = (state: RootState) =>
  state.pokedex.nextOffset !== null;

const selectFilterQuery = (state: RootState) => state.filter.query;

/** Lista filtrada en tiempo real por nombre (memoizada). */
export const selectFilteredPokemons = createSelector(
  [selectPokedexItems, selectFilterQuery],
  (items, query) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return items;
    }
    return items.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(normalized),
    );
  },
);
