import { PokemonListItem } from "@domain/entities/PokemonListItem";

export interface PokemonCacheRepository {
  save(pokemons: PokemonListItem[]): Promise<void>;
  load(): Promise<PokemonListItem[]>;
}
