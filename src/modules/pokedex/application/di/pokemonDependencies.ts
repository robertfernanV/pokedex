import { PokemonListController } from "@application/controllers/PokemonListController";
import { PokeApiPokemonRepository } from "@infrastructure/repositories/PokeApiPokemonRepository";

const pokemonRepository = new PokeApiPokemonRepository();

export const pokemonListController = new PokemonListController(
  pokemonRepository,
);
