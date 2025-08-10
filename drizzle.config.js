export default {
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: "postgresql://neondb_owner:npg_8mPw6WMyXtCE@ep-bitter-recipe-a85tzvx5-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
    connectionString:
      "postgresql://neondb_owner:npg_8mPw6WMyXtCE@ep-bitter-recipe-a85tzvx5-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
  },
};
