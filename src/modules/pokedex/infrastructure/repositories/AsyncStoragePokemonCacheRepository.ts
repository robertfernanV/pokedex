import { PokemonListItem } from "@domain/entities/PokemonListItem";
import { PokemonCacheRepository } from "@domain/repositories/PokemonCacheRepository";
import { STORAGE_KEYS } from "@infrastructure/storage/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class AsyncStoragePokemonCacheRepository
  implements PokemonCacheRepository
{
  async save(pokemons: PokemonListItem[]): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.lastPokemonList,
      JSON.stringify(pokemons),
    );
  }

  async load(): Promise<PokemonListItem[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.lastPokemonList);
    return raw ? (JSON.parse(raw) as PokemonListItem[]) : [];
  }
}
