import { PokemonListItem } from "@domain/entities/PokemonListItem";
import {
  loadFavorites,
  toggleFavorite,
} from "@presentation/store/favoritesThunks";
import { createSlice } from "@reduxjs/toolkit";

type FavoritesState = {
  items: PokemonListItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: FavoritesState = {
  items: [],
  status: "idle",
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadFavorites.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const favoritesReducer = favoritesSlice.reducer;
