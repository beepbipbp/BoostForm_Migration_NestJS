import * as dotenv from "dotenv";
import mongoose from "mongoose";
import * as redis from "redis";

dotenv.config();

// MongoDB 연결
function connectDB() {
	mongoose.connect(process.env.MONGODB_URL, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("mongoDB is connected...");
		}
	});
}

connectDB();

// redis 연결
const redisClient = redis.createClient({
	url: `redis://@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
	legacyMode: true,
});

redisClient.on("connect", () => {
	console.info("Redis connected!");
});
redisClient.on("error", (err) => {
	console.error("Redis Client Error", err);
});

redisClient.connect();

export const redisCli = redisClient.v4;
