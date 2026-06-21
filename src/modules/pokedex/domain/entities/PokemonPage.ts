import { PokemonListItem } from "@/modules/pokedex/domain/entities/PokemonListItem";

export interface PokemonPage {
  total: number;
  nextOffset: number | null;
  previousOffset: number | null;
  items: PokemonListItem[];
}
