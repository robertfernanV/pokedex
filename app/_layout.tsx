import { AppProviders } from "@presentation/providers/AppProviders";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="pokemon/[id]"
          options={{ title: "Detalle", headerBackTitle: "Atrás" }}
        />
      </Stack>
    </AppProviders>
  );
}
