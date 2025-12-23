import dotenv from "dotenv";

dotenv.config();

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
  jwt: {
    access: {
      secret:
        process.env.JWT_ACCESS_SECRET ||
        "6be984017d77e84a0656cf0c88aa3043e88bb50ef00da39f8dd2c207af4988e0",
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN) || 15 * 60,
    },
    refresh: {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        "eabcbedbc9a174ccf1c399a8f8d1c7d06258b6d9ab4b032b3c7ce7fcf107e9f2",
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN) || 7 * 24 * 60 * 60,
    },
  },
};
