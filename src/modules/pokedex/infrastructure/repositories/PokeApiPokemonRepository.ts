import { PokemonDetail } from "@domain/entities/PokemonDetail";
import { PokemonPage } from "@domain/entities/PokemonPage";
import { PokemonRepository } from "@domain/repositories/PokemonRepository";
import { axiosClient } from "@infrastructure/api/axiosClient";
import { PokeApiPokemonDetailDTO } from "@infrastructure/dtos/PokeApiPokemonDetailDTO";
import { PokeApiPokemonResponseDTO } from "@infrastructure/dtos/PokeApiPokemonResponseDTO";
import { PokeApiPokemonDetailMapper } from "@infrastructure/mappers/PokeApiPokemonDetailMapper";
import { PokeApiPokemonMapper } from "@infrastructure/mappers/PokeApiPokemonMapper";

export class PokeApiPokemonRepository implements PokemonRepository {
  async getPokemons(limit: number, offset: number): Promise<PokemonPage> {
    const response = await axiosClient.get<PokeApiPokemonResponseDTO>(
      "/pokemon",
      {
        params: { limit, offset },
      },
    );

    const { count, next, previous, results } = response.data;

    return {
      total: count,
      nextOffset: PokeApiPokemonMapper.extractOffsetFromUrl(next),
      previousOffset: PokeApiPokemonMapper.extractOffsetFromUrl(previous),
      items: results.map((result) =>
        PokeApiPokemonMapper.toPokemonListItem(result),
      ),
    };
  }

  async getPokemonDetail(idOrName: string): Promise<PokemonDetail> {
    const response = await axiosClient.get<PokeApiPokemonDetailDTO>(
      `/pokemon/${idOrName}`,
    );

    return PokeApiPokemonDetailMapper.toPokemonDetail(response.data);
  }
}
