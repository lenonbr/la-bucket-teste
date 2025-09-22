import z4 from "zod/v4";

const envSchema = z4.object({
    CLOUDFLARE_LENON_TESTE_TOKEN: z4.string(),
    CLOUDFLARE_LENON_TESTE_ACCESS_ID: z4.string(),
    CLOUDFLARE_LENON_TESTE_SECRET_KEY: z4.string(),
    CLOUDFLARE_LENON_TESTE_ENDPOINT: z4.string().url(),
    DATABASE_URL: z4.string().url(),
});

export const env = envSchema.parse(process.env);
