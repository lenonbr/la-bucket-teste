import {S3Client} from "@aws-sdk/client-s3";

export const r2 = new S3Client({
    region: "auto",
    endpoint: env.CLOUDFLARE_LENON_TESTE_ENDPOINT,
    credentials: {
        accessKeyId: env.CLOUDFLARE_LENON_TESTE_ACCESS_ID,
        secretAccessKey: env.CLOUDFLARE_LENON_TESTE_SECRET_KEY,
    },
});
