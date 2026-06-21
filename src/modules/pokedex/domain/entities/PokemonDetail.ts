export interface PokemonDetail {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
  height: number;
  weight: number;
}

export interface PokemonStat {
  name: string;
  value: number;
}
