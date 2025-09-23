import {FastifyInstance, FastifyPluginOptions} from "fastify";
import controller_bucket from "../controllers/controller_bucket";

export default async function route_bucket(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post("/uploads", controller_bucket.criar_url as any);
    fastify.put("/uploads", controller_bucket.criar_url as any);
    fastify.get("/uploads/:id", controller_bucket.baixar_pelo_id as any);
}
