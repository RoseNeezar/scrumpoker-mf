// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  REACT_APP_URL: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  NODE_ENV: z.string().optional(),
  PUSHER_APP_ID: z.string().optional(),
  REACT_APP_PUSHER_APP_KEY: z.string().optional(),
  REACT_APP_PUSHER_SERVER_HOST: z.string().optional(),
  REACT_APP_PUSHER_SERVER_PORT: z.string().optional(),
  REACT_APP_PUSHER_SERVER_TLS: z.string().optional(),
  REACT_APP_PUSHER_APP_CLUSTER: z.string().optional(),
  PUSHER_APP_SECRET: z.string().optional(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  REACT_APP_VERCEL_URL: z.string().optional(),
  REACT_APP_PUSHER_APP_KEY: z.string().optional(),
  REACT_APP_PUSHER_SERVER_HOST: z.string().optional(),
  REACT_APP_PUSHER_SERVER_PORT: z.string().optional(),
  REACT_APP_PUSHER_SERVER_TLS: z.string().optional(),
  REACT_APP_PUSHER_APP_CLUSTER: z.string().optional(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because React evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  REACT_APP_VERCEL_URL: process.env.REACT_APP_VERCEL_URL,
  REACT_APP_PUSHER_APP_KEY: process.env.REACT_APP_PUSHER_APP_KEY,
  REACT_APP_PUSHER_SERVER_HOST: process.env.REACT_APP_PUSHER_SERVER_HOST,
  REACT_APP_PUSHER_SERVER_PORT: process.env.REACT_APP_PUSHER_SERVER_PORT,
  REACT_APP_PUSHER_SERVER_TLS: process.env.REACT_APP_PUSHER_SERVER_TLS,
  REACT_APP_PUSHER_APP_CLUSTER: process.env.REACT_APP_PUSHER_APP_CLUSTER,
};
