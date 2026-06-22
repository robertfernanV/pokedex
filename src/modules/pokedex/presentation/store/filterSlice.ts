import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FilterState = {
  query: string;
};

const initialState: FilterState = {
  query: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = "";
    },
  },
});

export const { setQuery, clearQuery } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
