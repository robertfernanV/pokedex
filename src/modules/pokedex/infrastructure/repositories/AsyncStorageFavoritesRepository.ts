import { PokemonListItem } from "@domain/entities/PokemonListItem";
import { FavoritesRepository } from "@domain/repositories/FavoritesRepository";
import { STORAGE_KEYS } from "@infrastructure/storage/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class AsyncStorageFavoritesRepository implements FavoritesRepository {
  async getAll(): Promise<PokemonListItem[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.favorites);
    return raw ? (JSON.parse(raw) as PokemonListItem[]) : [];
  }

  async add(pokemon: PokemonListItem): Promise<void> {
    const current = await this.getAll();

    if (current.some((item) => item.id === pokemon.id)) {
      return;
    }

    await this.persist([...current, pokemon]);
  }

  async remove(id: number): Promise<void> {
    const current = await this.getAll();
    await this.persist(current.filter((item) => item.id !== id));
  }

  private async persist(pokemons: PokemonListItem[]): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.favorites,
      JSON.stringify(pokemons),
    );
  }
}
