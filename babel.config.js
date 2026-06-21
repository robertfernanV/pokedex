module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",

            "@modules": "./src/modules",

            "@pokedex": "./src/modules/pokedex",
            "@domain": "./src/modules/pokedex/domain",
            "@application": "./src/modules/pokedex/application",
            "@infrastructure": "./src/modules/pokedex/infrastructure",
            "@presentation": "./src/modules/pokedex/presentation",
          },
        },
      ],
    ],
  };
};
