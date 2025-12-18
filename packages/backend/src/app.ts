import helmet from "helmet";
import { PrismaClient } from "./generated/prisma/client";
import express from "express";
import cors from "cors";
import compression from "compression";
import { config } from "./config/config";
import rateLimit from "express-rate-limit";
export const createApp = (prisma: PrismaClient) => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );
  app.use(compression());

  // Rate limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many request from this IP, please try again later.",
  });
  app.use("/api/", limiter);

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Endpoints
  app.use("/", (req, res) => {
    res.json({
      message: "Money Tracker App API",
      version: config.api.version || "v1",
      environment: config.nodeEnv || "development",
      endpoints: {
        health: "/health",
      },
    });
  });

  app.use("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv || "development",
    });
  });

  // Error handler

  return app;
};
