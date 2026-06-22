import { PokemonDetail } from "@domain/entities/PokemonDetail";
import { PokeApiPokemonDetailDTO } from "@infrastructure/dtos/PokeApiPokemonDetailDTO";
import { PokeApiPokemonMapper } from "@infrastructure/mappers/PokeApiPokemonMapper";

export class PokeApiPokemonDetailMapper {
  static toPokemonDetail(dto: PokeApiPokemonDetailDTO): PokemonDetail {
    return {
      id: dto.id,
      name: dto.name,
      imageUrl:
        dto.sprites.other?.["official-artwork"]?.front_default ??
        PokeApiPokemonMapper.officialArtworkUrl(dto.id),
      types: dto.types.map((entry) => entry.type.name),
      abilities: dto.abilities.map((entry) => entry.ability.name),
      stats: dto.stats.map((entry) => ({
        name: entry.stat.name,
        value: entry.base_stat,
      })),
      height: dto.height,
      weight: dto.weight,
    };
  }
}
