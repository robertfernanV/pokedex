# Pokédex 🔴

Aplicación móvil de Pokédex construida con **Expo SDK 54 / React Native / TypeScript**,
siguiendo una **arquitectura hexagonal (Clean Architecture)** con inyección de
dependencias manual.

Consume la [PokeAPI](https://pokeapi.co/) y resuelve el reto técnico: listado con
scroll infinito, detalle, búsqueda, favoritos y persistencia offline.

---

## 🚀 Cómo correrlo

> Este proyecto usa **pnpm**.

```bash
pnpm install
pnpm start          # luego: 'a' (Android), 'i' (iOS) o escanea el QR con Expo Go
```

La URL base de la API se lee desde variables de entorno. El archivo `.env` ya
incluye:

```bash
EXPO_PUBLIC_POKE_API_BASE_URL=https://pokeapi.co/api/v2
```

Scripts útiles:

```bash
pnpm start          # arranca Metro / Expo
pnpm android        # abre en Android
pnpm ios            # abre en iOS
pnpm web            # abre en web
pnpm lint           # ESLint (eslint-config-expo)
npx tsc --noEmit    # type-check sin emitir
```

---

## ✅ Funcionalidades

| Requisito | Estado | Notas |
|---|---|---|
| Listado con **scroll infinito** | ✅ | Paginación por `offset`; guarda contra peticiones duplicadas |
| **Carga progresiva** de imágenes | ✅ | `expo-image` con `blurhash` + `transition` |
| **Detalle** (imagen, stats, tipos, habilidades) | ✅ | Barras de stats, datos de altura/peso |
| **Filtro** en tiempo real por nombre | ✅ | Sobre la lista cargada (ver *Limitaciones conocidas*) |
| **Favoritos** (agregar / quitar / listar) | ✅ | Persistidos en `AsyncStorage` |
| **Persistencia offline** | ✅ | Favoritos + última lista; fallback a caché si falla la red |
| **Skeletons / loaders** | ✅ | Skeleton animado en la carga inicial |
| **Manejo de errores** (lista vacía / sin resultados) | ✅ | Componente `StateMessage` reutilizable |
| Testing | ⬜ | Opcional, pendiente |

---

## 🏛️ Arquitectura

El código vive en `src/modules/pokedex/`, separado en 4 capas. La regla de oro es
la **dirección de dependencias**:

```
presentation ──▶ application ──▶ domain ◀── infrastructure
                      │                          ▲
                      └────── application/di ─────┘  (composition root)
```

- **`domain`** no conoce a nadie. Entidades puras + interfaces de repositorio.
- **`application`** depende solo de contratos del dominio (controllers, sin casos de uso).
- **`infrastructure`** implementa los contratos del dominio (PokeAPI vía Axios, AsyncStorage).
- **`presentation`** habla únicamente con los controllers; nunca toca Axios ni instancia repos.
- **`application/di`** es el *composition root*: arma las piezas manualmente (sin framework de DI).

### Estructura de carpetas

```
app/                                  # Rutas (Expo Router)
├── _layout.tsx                       # Provider de Redux + Stack raíz
├── (tabs)/                           # Tabs: Pokédex / Favoritos
│   ├── _layout.tsx
│   ├── index.tsx                     # → PokemonListScreen
│   └── favorites.tsx                 # → FavoritesScreen
└── pokemon/[id].tsx                  # → PokemonDetailScreen

src/modules/pokedex/
├── domain/                           # 🧩 Núcleo (puro, sin dependencias)
│   ├── entities/                     # PokemonListItem, PokemonPage, PokemonDetail
│   └── repositories/                 # Contratos: Pokemon, Favorites, PokemonCache
│
├── application/                      # 🎯 Coordinación
│   ├── controllers/                  # PokemonList, PokemonDetail, Favorites
│   └── di/pokemonDependencies.ts     # Composition root (DI manual)
│
├── infrastructure/                   # 🔌 Detalles externos
│   ├── api/axiosClient.ts            # Cliente Axios (baseURL desde env)
│   ├── config/env.ts                 # Lectura de variables de entorno
│   ├── dtos/                         # Forma cruda de las respuestas de PokeAPI
│   ├── mappers/                      # DTO → entidad de dominio
│   ├── repositories/                 # PokeAPI + AsyncStorage (favoritos, caché)
│   └── storage/storageKeys.ts        # Claves de AsyncStorage
│
└── presentation/                     # 📱 UI (React Native + Redux)
    ├── components/                   # PokemonCard (compound), SearchBar, Skeleton, StateMessage
    ├── screens/                      # List, Detail, Favorites
    ├── hooks/                        # usePokemonDetail
    ├── providers/                    # AppProviders (Redux + SafeArea + bootstrap)
    └── store/                        # Redux Toolkit: slices, thunks, selectors
```

### Flujo de una petición

```
PokemonListScreen (presentation)
  └─ dispatch(loadPokemons)              thunk de Redux
       └─ PokemonListController          (application)
            └─ PokemonRepository         (contrato de dominio)
                 └─ PokeApiPokemonRepository   (infrastructure)
                      ├─ axiosClient → PokeAPI
                      └─ PokeApiPokemonMapper: DTO → entidad de dominio
```

---

## 🧠 Decisiones técnicas

- **Estado global con Redux Toolkit**, viviendo **solo en `presentation/store`**
  (slices de `pokedex`, `favorites`, `filter`). El dominio y la infraestructura no
  saben que Redux existe.
- **Inyección de dependencias manual** en `application/di` (sin Inversify ni similares).
- **Compound Pattern** en `PokemonCard`: subcomponentes (`.Image`, `.Id`, `.Name`,
  `.Body`, `.FavoriteButton`) que comparten el pokémon vía Context, permitiendo
  composición flexible por pantalla. El botón de favorito usa Redux internamente.
- **Persistencia offline**: `AsyncStorage` detrás de contratos de dominio
  (`FavoritesRepository`, `PokemonCacheRepository`). Si la red falla, `loadPokemons`
  sirve la última lista cacheada y marca el estado `isOffline`.
- **Carga progresiva** con `expo-image` (placeholder `blurhash` + `transition`),
  sin librerías extra.

---

## ⚠️ Limitaciones conocidas / mejoras futuras

- **Navegación**: el reto sugería *React Navigation v6*, pero Expo SDK 54 + React 19
  requieren **v7** (sobre la que corre Expo Router). Se usó **Expo Router** (file-based
  routing), que es React Navigation por debajo.
- **Filtro de búsqueda**: opera sobre los pokémon ya cargados por el scroll. PokeAPI
  no expone búsqueda parcial por nombre; para buscar en toda la Pokédex habría que
  precargar el índice liviano completo (`/pokemon?limit=100000`) y filtrar en cliente.
- **Detección offline**: hoy es *request-driven* (se infiere cuando una petición falla
  y hay caché), no en tiempo real. La detección en vivo requeriría
  `@react-native-community/netinfo`.
- **Testing**: pendiente (Jest + `jest-expo`); mappers, repos de AsyncStorage y
  slices/thunks son los candidatos naturales.

---

## 🛠️ Stack

Expo SDK 54 · React Native 0.81 · React 19 · TypeScript · Expo Router · Redux Toolkit ·
Axios · AsyncStorage · expo-image
