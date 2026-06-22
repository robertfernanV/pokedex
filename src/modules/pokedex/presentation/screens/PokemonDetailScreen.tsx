import { StateMessage } from "@presentation/components/StateMessage";
import { usePokemonDetail } from "@presentation/hooks/usePokemonDetail";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BLURHASH = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";
const MAX_STAT = 255; // tope teórico de una stat base en PokeAPI

export function PokemonDetailScreen({ idOrName }: { idOrName: string }) {
  const { detail, loading, error, reload } = usePokemonDetail(idOrName);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !detail) {
    return (
      <StateMessage
        emoji="⚠️"
        title="No se pudo cargar el detalle"
        message={error ?? "Inténtalo de nuevo."}
        actionLabel="Reintentar"
        onAction={reload}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.hero}>
        <Image
          style={styles.image}
          source={{ uri: detail.imageUrl }}
          placeholder={{ blurhash: BLURHASH }}
          contentFit="contain"
          transition={400}
        />
        <Text style={styles.id}>#{String(detail.id).padStart(3, "0")}</Text>
        <Text style={styles.name}>{detail.name}</Text>
      </View>

      <Section title="Tipos">
        <View style={styles.chips}>
          {detail.types.map((type) => (
            <View key={type} style={styles.chip}>
              <Text style={styles.chipText}>{type}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Habilidades">
        <View style={styles.chips}>
          {detail.abilities.map((ability) => (
            <View key={ability} style={[styles.chip, styles.abilityChip]}>
              <Text style={styles.chipText}>{ability}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Estadísticas">
        {detail.stats.map((stat) => (
          <View key={stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{stat.name}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <View style={styles.statBarTrack}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${Math.min(100, (stat.value / MAX_STAT) * 100)}%` },
                ]}
              />
            </View>
          </View>
        ))}
      </Section>

      <Section title="Datos">
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Altura</Text>
          <Text style={styles.dataValue}>{detail.height / 10} m</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Peso</Text>
          <Text style={styles.dataValue}>{detail.weight / 10} kg</Text>
        </View>
      </Section>
    </ScrollView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  content: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
  },
  id: {
    fontSize: 14,
    color: "#888",
    fontWeight: "700",
    marginTop: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#5b8def",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  abilityChip: {
    backgroundColor: "#7c4dff",
  },
  chipText: {
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statName: {
    width: 120,
    fontSize: 13,
    color: "#555",
    textTransform: "capitalize",
  },
  statValue: {
    width: 36,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
  statBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e3e3e3",
    overflow: "hidden",
  },
  statBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4caf50",
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dataLabel: {
    fontSize: 14,
    color: "#666",
  },
  dataValue: {
    fontSize: 14,
    fontWeight: "700",
  },
});
