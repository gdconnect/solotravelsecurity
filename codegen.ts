import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * Types-only codegen: zero runtime bytes.
 * The generated module holds interfaces/types exclusively, so client bundles
 * and page sizes remain zero-overhead.
 */
const config: CodegenConfig = {
  schema: "src/lib/graphql/schema.graphql",
  documents: ["src/lib/graphql/operations/**/*.graphql", "src/lib/graphql/fragments/**/*.graphql"],
  generates: {
    "src/lib/graphql/__generated__/types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        onlyOperationTypes: true,
        skipTypename: false,
        useTypeImports: true,
      },
    },
  },
};

export default config;
