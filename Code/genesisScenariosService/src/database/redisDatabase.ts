import { networkInterfaces } from 'os';
import redis, { createClient } from 'redis';
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
        redisClient.set("genesis.broker.scenario", currentAddress as string, { EX: 30 });
        // Keep the key alive while the service is running
        setInterval(() => { redisClient.set("genesis.broker.scenario", currentAddress as string, { EX: 30 }); }, 25000);
    })

    // Log any errors
    redisClient.on('error', error => {
        logger.error('Redis Error: ' + error);
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