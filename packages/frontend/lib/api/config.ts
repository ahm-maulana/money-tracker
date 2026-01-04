import { CreateAxiosDefaults } from "axios";

export const API_CONFIG: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
} as const;
