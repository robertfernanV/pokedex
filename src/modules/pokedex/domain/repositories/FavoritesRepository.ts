import { PokemonListItem } from "@domain/entities/PokemonListItem";

export interface FavoritesRepository {
  getAll(): Promise<PokemonListItem[]>;
  add(pokemon: PokemonListItem): Promise<void>;
  remove(id: number): Promise<void>;
}
