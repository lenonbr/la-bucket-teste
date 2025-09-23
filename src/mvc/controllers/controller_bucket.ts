//BIBLIOTECAS
import z4 from "zod/v4";
import {randomUUID} from "crypto";
import {r2} from "../../lib/cloudflare";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
//HELPERS

//BANCO DE DADOS
import prisma from "../../db_conn.ts/db_conn";

//SERVICES

const controller_bucket = class controller_bucket {
    static async criar_url(req: any) {
        const uploadBodySchema = z4.object({
            name: z4.string().min(1),
            contentType: z4.string().regex(/\w+\/[-+\w]+/),
        });

        const {name, contentType} = uploadBodySchema.parse(req.body);

        const fileKey = randomUUID().concat("-").concat(name);

        const signedUrl = await getSignedUrl(
            r2,
            new PutObjectCommand({
                Bucket: "lenon-bucket-teste",
                Key: fileKey,
                ContentType: contentType,
            }),
            {expiresIn: 600}
        );

        const file = await prisma.file.create({
            data: {
                name,
                contentType,
                key: fileKey,
            },
        });

        return {
            data: {
                signedUrl,
                fileId: file.id,
            },
        };
    }

    static async enviar_arquivo(req: any) {}

    static async baixar_pelo_id(req: any) {
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
    }
};

export default controller_bucket;
