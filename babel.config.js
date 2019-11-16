module.exports = function (api) {

  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        // "useBuiltIns": "entry"
      }
    ]
  ]

  return {
      presets,
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            "absoluteRuntime": false,
            "corejs": false,
            "helpers": false,
            "runtimeHelpers": true,
            "regenerator": true,
            "useESModules": false
          }
        ],
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-proposal-optional-chaining"
      ]
  }

}