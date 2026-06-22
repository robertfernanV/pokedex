import { PokemonDetail } from "@domain/entities/PokemonDetail";
import { PokemonRepository } from "@domain/repositories/PokemonRepository";

export class PokemonDetailController {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async getPokemonDetail(idOrName: string): Promise<PokemonDetail> {
    return this.pokemonRepository.getPokemonDetail(idOrName);
  }
}
