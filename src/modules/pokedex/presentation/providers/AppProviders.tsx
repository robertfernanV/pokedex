import { loadFavorites } from "@presentation/store/favoritesThunks";
import { useAppDispatch } from "@presentation/store/hooks";
import { store } from "@presentation/store/store";
import { ReactNode, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

function FavoritesBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  // Hidrata los favoritos persistidos al arrancar la app, para que el estado
  // "es favorito" sea correcto en todas las pantallas desde el primer render.
  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  return <>{children}</>;
}

/** Punto único donde se monta el store de Redux sobre toda la app. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <FavoritesBootstrap>{children}</FavoritesBootstrap>
      </SafeAreaProvider>
    </Provider>
  );
}
