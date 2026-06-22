import { FavoritesController } from "@application/controllers/FavoritesController";
import { PokemonDetailController } from "@application/controllers/PokemonDetailController";
import { PokemonListController } from "@application/controllers/PokemonListController";
import { AsyncStorageFavoritesRepository } from "@infrastructure/repositories/AsyncStorageFavoritesRepository";
import { AsyncStoragePokemonCacheRepository } from "@infrastructure/repositories/AsyncStoragePokemonCacheRepository";
import { PokeApiPokemonRepository } from "@infrastructure/repositories/PokeApiPokemonRepository";

const pokemonRepository = new PokeApiPokemonRepository();
const favoritesRepository = new AsyncStorageFavoritesRepository();
const pokemonCacheRepository = new AsyncStoragePokemonCacheRepository();

export const pokemonListController = new PokemonListController(
  pokemonRepository,
  pokemonCacheRepository,
);

export const pokemonDetailController = new PokemonDetailController(
  pokemonRepository,
);

export const favoritesController = new FavoritesController(favoritesRepository);
