import { PokemonListItem } from "@domain/entities/PokemonListItem";
import {
  loadMorePokemons,
  loadPokemons,
} from "@presentation/store/pokedexThunks";
import { createSlice } from "@reduxjs/toolkit";

export type PokedexStatus =
  | "idle"
  | "loading"
  | "loadingMore"
  | "succeeded"
  | "failed";

type PokedexState = {
  items: PokemonListItem[];
  nextOffset: number | null;
  total: number;
  status: PokedexStatus;
  error: string | null;
  isOffline: boolean;
};

const initialState: PokedexState = {
  items: [],
  nextOffset: 0,
  total: 0,
  status: "idle",
  error: null,
  isOffline: false,
};

const pokedexSlice = createSlice({
  name: "pokedex",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Carga inicial / refresh ---
      .addCase(loadPokemons.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadPokemons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.nextOffset = action.payload.nextOffset;
        state.total = action.payload.total;
        state.isOffline = action.payload.offline;
      })
      .addCase(loadPokemons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error desconocido";
      })
      // --- Paginación (infinite scroll) ---
      .addCase(loadMorePokemons.pending, (state) => {
        state.status = "loadingMore";
      })
      .addCase(loadMorePokemons.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Dedupe por id como red de seguridad ante páginas repetidas.
        const existingIds = new Set(state.items.map((item) => item.id));
        const newItems = action.payload.items.filter(
          (item) => !existingIds.has(item.id),
        );
        state.items = [...state.items, ...newItems];
        state.nextOffset = action.payload.nextOffset;
        state.total = action.payload.total;
      })
      .addCase(loadMorePokemons.rejected, (state) => {
        // Sin más páginas o fallo puntual: volvemos a un estado estable
        // sin romper la lista ya cargada.
        state.status = "succeeded";
      });
  },
});

export const pokedexReducer = pokedexSlice.reducer;
