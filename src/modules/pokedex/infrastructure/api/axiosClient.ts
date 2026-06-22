import { env } from "@infrastructure/config/env";
import { create } from "axios";

export const axiosClient = create({
  baseURL: env.pokeApiBaseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
