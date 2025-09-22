import fastify from "fastify";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {r2} from "../lib/cloudflare";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const app = fastify();

app.post("/uploads", async () => {
    const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
            Bucket: "lenon-bucket-teste",
            Key: "file.mp4",
            ContentType: "video/mp4",
        }),
        {expiresIn: 600}
    );

    return signedUrl;
});

app.listen({
    port: 3333,
    host: "0.0.0.0",
}).then(() => {
    console.log("HTTP server running!");
});
