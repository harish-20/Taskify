import { config as baseConfig } from "@repo/eslint-config/base";
import importPlugin from "eslint-plugin-import";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    plugins: {
      import: importPlugin,
    },

    settings: {
      "import/resolver": {
        node: true,
      },
    },

    rules: {
      // Import plugin recommended rules
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,

      // Resolver-dependent rules are disabled because the TS resolver
      // in this workspace is currently incompatible with eslint-plugin-import.
      "import/namespace": "off",
      "import/default": "off",
      "import/named": "off",
      "import/no-unresolved": "off",

      // Custom rules
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      "import/no-duplicates": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-cycle": "warn",
    },
  },
];
