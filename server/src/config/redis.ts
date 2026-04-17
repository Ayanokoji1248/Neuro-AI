import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

type RedisSetOptions = {
    EX?: number;
};

type RedisLikeClient = {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, options?: RedisSetOptions): Promise<string | null>;
    del(key: string): Promise<number>;
};

class UpstashRestRedisClient implements RedisLikeClient {
    constructor(
        private readonly restUrl: string,
        private readonly token: string
    ) { }

    private async command<T>(...args: Array<string | number>): Promise<T> {
        const response = await fetch(this.restUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(args)
        });

        const data = await response.json() as { result?: T; error?: string };

        if (!response.ok || data.error) {
            throw new Error(data.error ?? `Upstash request failed with status ${response.status}`);
        }

        return data.result as T;
    }

    async get(key: string): Promise<string | null> {
        return this.command<string | null>("GET", key);
    }

    async set(key: string, value: string, options?: RedisSetOptions): Promise<string | null> {
        const command: Array<string | number> = ["SET", key, value];

        if (options?.EX) {
            command.push("EX", options.EX);
        }

        return this.command<string | null>(...command);
    }

    async del(key: string): Promise<number> {
        return this.command<number>("DEL", key);
    }
}

async function createRedisClient(): Promise<RedisLikeClient> {
    const upstashRestUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (upstashRestUrl && upstashRestToken) {
        console.log("Using Upstash Redis over REST");
        return new UpstashRestRedisClient(upstashRestUrl, upstashRestToken);
    }

    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        throw new Error("Redis configuration missing. Set Upstash REST credentials or REDIS_URL.");
    }

    const client = createClient({
        url: redisUrl
    });

    client.on("error", (err) => console.log("Redis Error", err));
    client.on("connect", () => console.log("Redis connected"));

    await client.connect();

    return client as unknown as RedisLikeClient;
}

export const redisClient = await createRedisClient();
