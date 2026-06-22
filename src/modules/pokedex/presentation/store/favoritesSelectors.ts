import type { RootState } from "@presentation/store/store";

export const selectFavorites = (state: RootState) => state.favorites.items;

export const selectFavoritesStatus = (state: RootState) =>
  state.favorites.status;

export const selectIsFavorite = (state: RootState, id: number) =>
  state.favorites.items.some((item) => item.id === id);
