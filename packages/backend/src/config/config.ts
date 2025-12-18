export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  supabase: {
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    databaseUrl: process.env.DATABASE_URL || "",
  },
  api: {
    version: process.env.API_VERSION || "v1",
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
