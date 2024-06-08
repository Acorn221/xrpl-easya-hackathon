import baseConfig from "@sobrxrpl/eslint-config/base";
import reactConfig from "@sobrxrpl/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
