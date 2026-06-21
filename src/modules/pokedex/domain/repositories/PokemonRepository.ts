import { PokemonDetail } from "@/modules/pokedex/domain/entities/PokemonDetail";
import { PokemonPage } from "@/modules/pokedex/domain/entities/PokemonPage";

export interface PokemonRepository {
  getPokemons(limit: number, offset: number): Promise<PokemonPage>;

  getPokemonDetail(idOrName: string): Promise<PokemonDetail>;
}
