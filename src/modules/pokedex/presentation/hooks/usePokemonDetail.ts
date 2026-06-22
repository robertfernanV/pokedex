import { pokemonDetailController } from "@application/di/pokemonDependencies";
import { PokemonDetail } from "@domain/entities/PokemonDetail";
import { useCallback, useEffect, useState } from "react";

type UsePokemonDetailResult = {
  detail: PokemonDetail | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

/**
 * Carga el detalle de un pokémon desde la capa de aplicación.
 * El detalle es estado efímero por pantalla, así que se maneja con estado
 * local (no necesita vivir en Redux).
 */
export function usePokemonDetail(idOrName: string): UsePokemonDetailResult {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await pokemonDetailController.getPokemonDetail(idOrName);
      setDetail(result);
    } catch {
      setError("No se pudo cargar el detalle del pokémon.");
    } finally {
      setLoading(false);
    }
  }, [idOrName]);

  useEffect(() => {
    load();
  }, [load]);

  return { detail, loading, error, reload: load };
}
