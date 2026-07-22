function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

function getNodeEnv(): "development" | "production" | "test" {
  return (process.env.NODE_ENV as "development" | "production" | "test") ?? "development";
}

export const env = {
  NODE_ENV: getNodeEnv(),
  DATABASE_URL: requireEnv("DATABASE_URL"),
  AUTH_SECRET: requireEnv("AUTH_SECRET"),
  ADMIN_JWT_SECRET: requireEnv("ADMIN_JWT_SECRET"),
  APP_URL: optionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  XENDIT_MODE: optionalEnv("XENDIT_MODE", "test"),
};

// Validate on import in production
if (env.NODE_ENV === "production") {
  if (!env.ADMIN_JWT_SECRET || env.ADMIN_JWT_SECRET === "dev-admin-jwt-secret-change-me") {
    throw new Error("ADMIN_JWT_SECRET must be set to a secure random value in production");
  }
}
