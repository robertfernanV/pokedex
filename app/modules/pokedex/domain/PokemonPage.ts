import { PokemonListItem } from "./PokemonListItem";

export interface PokemonPage {
  total: number;
  nextOffset: number | null;
  previousOffset: number | null;
  items: PokemonListItem[];
}
