import { PokemonDetail } from "./PokemonDetail";
import { PokemonPage } from "./PokemonPage";

export interface PokemonRepository {
  getPokemonPage(params: {
    limit: number;
    offset: number;
  }): Promise<PokemonPage>;

  getPokemonDetail(idOrName: string): Promise<PokemonDetail>;
}
