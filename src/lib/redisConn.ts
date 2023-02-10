import Redis from "ioredis";
import { UPSTASH_REDIS_REST_URL } from "$env/static/private";

const redis = new Redis(UPSTASH_REDIS_REST_URL);

export default redis;
