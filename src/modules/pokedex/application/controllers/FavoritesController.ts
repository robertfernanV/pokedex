import { PokemonListItem } from "@domain/entities/PokemonListItem";
import { FavoritesRepository } from "@domain/repositories/FavoritesRepository";

export class FavoritesController {
  constructor(private readonly favoritesRepository: FavoritesRepository) {}

  async getFavorites(): Promise<PokemonListItem[]> {
    return this.favoritesRepository.getAll();
  }

  async addFavorite(pokemon: PokemonListItem): Promise<void> {
    await this.favoritesRepository.add(pokemon);
  }

  async removeFavorite(id: number): Promise<void> {
    await this.favoritesRepository.remove(id);
  }
}
