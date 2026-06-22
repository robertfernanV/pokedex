const pokeApiBaseUrl = process.env.EXPO_PUBLIC_POKE_API_BASE_URL;

if (!pokeApiBaseUrl) {
  throw new Error("Missing EXPO_PUBLIC_POKE_API_BASE_URL");
}

export const env = {
  pokeApiBaseUrl,
};
