import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/final-elite-*.ts", "**/elite-category-system.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    }
  },
  {
    files: ["**/mcp/**/*.ts", "**/types/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    }
  },
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "import/no-anonymous-default-export": "warn",
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "deploy/**",
    "next-env.d.ts",
    // Node.js scripts that use CommonJS
    "scripts/**",
    "*.js",
    "!eslint.config.mjs",
  ]),
]);

export default eslintConfig;
