import { PokemonListItem } from "@domain/entities/PokemonListItem";

export class PokeApiPokemonMapper {
  private static readonly OFFICIAL_ARTWORK_BASE_URL =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

  static toPokemonListItem(apiPokemon: {
    name: string;
    url: string;
  }): PokemonListItem {
    const id = this.extractIdFromUrl(apiPokemon.url);

    return {
      id,
      name: apiPokemon.name,
      detailUrl: apiPokemon.url,
      imageUrl: this.officialArtworkUrl(id),
    };
  }

  static officialArtworkUrl(id: number): string {
    return `${this.OFFICIAL_ARTWORK_BASE_URL}/${id}.png`;
  }

  static extractIdFromUrl(url: string): number {
    return Number(url.split("/").filter(Boolean).pop());
  }

  static extractOffsetFromUrl(url: string | null): number | null {
    if (!url) {
      return null;
    }

    const match = url.match(/[?&]offset=(\d+)/);

    return match ? Number(match[1]) : null;
  }
}
