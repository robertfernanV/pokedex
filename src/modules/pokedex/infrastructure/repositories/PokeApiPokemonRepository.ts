import { PokemonPage } from "@/modules/pokedex/domain/entities/PokemonPage";
import { PokeApiPokemonResponseDTO } from "@/modules/pokedex/infrastructure/dtos/PokeApiPokemonResponseDTO";
import { PokemonDetail } from "@domain/entities/PokemonDetail";
import { PokemonRepository } from "@domain/repositories/PokemonRepository";
import { axiosClient } from "@infrastructure/api/axiosClient";

export class PokeApiPokemonRepository implements PokemonRepository {
  getPokemon(limit: number, offset: number): Promise<PokemonPage> {
    throw new Error("Method not implemented.");
  }
  async getPokemons(limit: number, offset: number): Promise<PokemonPage> {
    const response = axiosClient.get<PokeApiPokemonResponseDTO>(`/pokemon`, {
      params: {
        limit,
        offset,
      },
    });
    return {
      total: 0,
      nextOffset: 20,
      previousOffset: 0,
      items: [],
    };
  }
  getPokemonDetail(idOrName: string): Promise<PokemonDetail> {
    throw new Error("Method not implemented.");
  }
}
