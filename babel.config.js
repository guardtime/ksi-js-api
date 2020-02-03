module.exports = function (api) {
  api.cache(true);

  const presets = [
    "@babel/env", "@babel/typescript"
  ];
  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime"
  ];

  return {
    presets,
    plugins
  };
}
