import { networkInterfaces } from 'os';
import { createClient, RedisClientType } from 'redis';
import winston from 'winston';
import { ServerConfiguration } from '../config/config';

// redis connection object
const redisConnection = (config: ServerConfiguration, logger: winston.Logger) => {
    // Create a connection to the redis database
    const redisClient = createClient({
        url: `redis://${config.redisIp}:${config.redisPort}`
    });

    // Connect and register this service
    redisClient.connect().then(() => {
        // Get the ip address where this service is running
        let currentAddress = getIpAddress();
        if (!currentAddress) logger.error("Couldn't determine a local ip address");
        // Store the ip address in the redis database
        redisClient.set("genesis.broker.genesisScenarioService", currentAddress as string, { EX: config.keepAliveSecs }).then(() => {
            logger.info(`Registered service at ${currentAddress}`);
            redisClient.disconnect();
        });
        // Keep the key alive while the service is running
        setInterval(() => {
            // @ts-ignore
            SendKeepAlive(redisClient, currentAddress, config.keepAliveSecs).then(() => { logger.info('Sent Keep Alive'); });
        }, (config.keepAliveSecs - 5) * 1000);
    })

    // Log any Events
    redisClient.on('error', error => {
        logger.error('Redis Error: ' + error);
    });

    redisClient.on('connect', () => {
        logger.info('Connected to Redis!');
    });

    redisClient.on('end', () => {
        logger.info('Disconnected from Redis!');
    });

    redisClient.on('reconnecting', () => {
        logger.info('Attempting to reconnect to Redis!');
    });

}

// Export the redis connection object
export default redisConnection;

// Helper functions
export const getIpAddress = () => {
    const networkData = networkInterfaces();
    let ipv4Addresses: string[] = [];
    for (const entry in networkData) {
        networkData[entry]?.forEach((netType) => {
            if (netType.family === 'IPv4') {
                ipv4Addresses.push(netType.address);
            }
        });
    }
    // Select the first address that is not local host (127)
    for (const address of ipv4Addresses) {
        if (!address.includes('127.0.0.1')) {
            return address;
        }
    }
    // No valid addresses could be found
    return;
}

const SendKeepAlive = (redisClient: RedisClientType, currentAddress: string, keepAliveSecs: number) => {
    return new Promise<void>((resolve, reject) => {
        redisClient.connect().then(() => {
            redisClient.set("genesis.broker.genesisScenarioService", currentAddress, { EX: keepAliveSecs })
                .then(() => {
                    redisClient.disconnect();
                    resolve();
                });
        });
    });
}