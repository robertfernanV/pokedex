import { configureStore } from "@reduxjs/toolkit";
import { favoritesReducer } from "@presentation/store/favoritesSlice";
import { filterReducer } from "@presentation/store/filterSlice";
import { pokedexReducer } from "@presentation/store/pokedexSlice";

export const store = configureStore({
  reducer: {
    pokedex: pokedexReducer,
    favorites: favoritesReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
