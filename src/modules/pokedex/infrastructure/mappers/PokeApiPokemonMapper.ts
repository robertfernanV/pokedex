import { PokemonListItem } from "@/modules/pokedex/domain/entities/PokemonListItem";

export class PokeApiPokemonMapper {
  static toPokemonListItem(apiPokemon: {
    name: string;
    url: string;
  }): PokemonListItem {
    const id = Number(apiPokemon.url.split("/").filter(Boolean).pop());

    return {
      id,
      name: apiPokemon.name,
      detailUrl: "",
      imageUrl: "",
    };
  }
}
