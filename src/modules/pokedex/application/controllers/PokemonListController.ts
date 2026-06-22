import { PokemonListItem } from "@domain/entities/PokemonListItem";
import { PokemonPage } from "@domain/entities/PokemonPage";
import { PokemonCacheRepository } from "@domain/repositories/PokemonCacheRepository";
import { PokemonRepository } from "@domain/repositories/PokemonRepository";

export class PokemonListController {
  constructor(
    private readonly pokemonRepository: PokemonRepository,
    private readonly pokemonCacheRepository: PokemonCacheRepository,
  ) {}

  async getPokemons(limit = 20, offset = 0): Promise<PokemonPage> {
    return this.pokemonRepository.getPokemons(limit, offset);
  }

  async savePokemons(pokemons: PokemonListItem[]): Promise<void> {
    await this.pokemonCacheRepository.save(pokemons);
  }

  async getCachedPokemons(): Promise<PokemonListItem[]> {
    return this.pokemonCacheRepository.load();
  }
}
