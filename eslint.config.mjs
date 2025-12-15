import nextPlugin from "eslint-config-next";

export default [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...nextPlugin,
];
