// @ts-nocheck
import { clientEnv, clientSchema } from "./schema";

const _clientEnv = clientSchema.safeParse(clientEnv);

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

if (!_clientEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_clientEnv.error.format())
  );
  throw new Error("Invalid environment variables");
}

for (let key of Object.keys(_clientEnv.data)) {
  if (!key.startsWith("REACT_APP_")) {
    console.warn(
      `❌ Invalid public environment variable name: ${key}. It must begin with 'REACT_APP_'`
    );

    throw new Error("Invalid public environment variable name");
  }
}

export const env = _clientEnv.data;
