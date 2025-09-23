import fastify from "fastify";
import {GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {r2} from "../lib/cloudflare";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import z4 from "zod/v4";
import {randomUUID} from "crypto";
import {PrismaClient} from "../generated/prisma";

//routes
import route_bucket from "../mvc/routes/route_bucket";

const app = fastify();

const prisma = new PrismaClient();

// app.post("/uploads", async (req) => {
//     const uploadBodySchema = z4.object({
//         name: z4.string().min(1),
//         contentType: z4.string().regex(/\w+\/[-+\w]+/),
//     });

//     const {name, contentType} = uploadBodySchema.parse(req.body);

//     const fileKey = randomUUID().concat("-").concat(name);

//     const signedUrl = await getSignedUrl(
//         r2,
//         new PutObjectCommand({
//             Bucket: "lenon-bucket-teste",
//             Key: fileKey,
//             ContentType: contentType,
//         }),
//         {expiresIn: 600}
//     );

//     const file = await prisma.file.create({
//         data: {
//             name,
//             contentType,
//             key: fileKey,
//         },
//     });

//     return {signedUrl, fileId: file.id};
// });

app.register(route_bucket);

app.get("/uploads/:id", async (req) => {
    const getFileParamsSchema = z4.object({
        id: z4.string().cuid(),
    });

    const {id} = getFileParamsSchema.parse(req.params);

    const file = await prisma.file.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const signedUrl = await getSignedUrl(
        r2,
        new GetObjectCommand({
            Bucket: "lenon-bucket-teste",
            Key: file.key,
        }),
        {expiresIn: 600}
    );

    return {signedUrl};
});

app.listen({
    port: 3333,
    host: "0.0.0.0",
}).then(() => {
    console.log("HTTP server running!");
});
