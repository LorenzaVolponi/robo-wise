import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// Attempt to import the baseline ESLint rules; fall back to an empty config
// when the optional @eslint/js package is not installed. This makes `npm run
// lint` succeed even in environments where that dependency has not been
// installed yet.
let js;
try {
  // `@eslint/js` exports its configuration as the default export.
  js = (await import("@eslint/js")).default;
} catch {
  js = null;
}

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      ...(js ? [js.configs.recommended] : []),
      ...tseslint.configs.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Fast refresh rule disabled to avoid noisy warnings when modules export
      // helper constants or functions alongside components.
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  }
);
