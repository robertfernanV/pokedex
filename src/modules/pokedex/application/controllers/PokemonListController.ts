import { PokemonPage } from "@domain/entities/PokemonPage";
import { PokemonRepository } from "@domain/repositories/PokemonRepository";

export class PokemonListController {
  constructor(private readonly pokemonRepository: PokemonRepository) {}
  async getPokemons(): Promise<PokemonPage> {
    return this.pokemonRepository.getPokemons(20, 0);
  }
}
