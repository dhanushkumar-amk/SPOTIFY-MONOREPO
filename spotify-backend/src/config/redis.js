// config/redis.js
import Redis from 'ioredis';


const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
 console.log(`[Worker ${process.pid}] Connected to Redis`);

});

export default redisClient;
