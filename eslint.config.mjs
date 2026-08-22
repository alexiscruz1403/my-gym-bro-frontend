import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Los regenera @ducanh2912/next-pwa en cada build. Aportaban 47 de los
      // 72 warnings del repo, todos sobre codigo que nadie escribio.
      "public/sw.js",
      "public/workbox-*.js",
      "public/worker-*.js",
      "public/fallback-*.js",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // El prefijo _ es la forma de decir "esto no se usa a proposito": hace
      // falta para respetar la firma de un callback o el orden posicional.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
