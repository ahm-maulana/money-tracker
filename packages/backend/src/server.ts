import dotenv from "dotenv";
import { config } from "./config/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { createApp } from "./app";

// Load environment variables
dotenv.config();

// Initialize Prisma Client with adapter
const connectionString = config.supabase.databaseUrl;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Create Express app
const app = createApp(prisma);

// PORT
const PORT = config.port;

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  try {
    // Close database connection
    await prisma.$disconnect();

    // Close server
    process.exit(0);
  } catch (error) {
    console.error("Failed to shutdown server:", error);
    process.exit(1);
  }
};

// Handle shutdown signal
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("uncaughtException", (error) => {
  console.error(`Uncaught exception:`, error);
  gracefulShutdown("uncaughtException");
});
process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandled rejection at:`, promise, "reason:", reason);
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully.");

    // Star listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT ${PORT}`);
      console.log(`📝 Environment: ${config.nodeEnv || "development"}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    process.exit(1);
  }
}

startServer();
