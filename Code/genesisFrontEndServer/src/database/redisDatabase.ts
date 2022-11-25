import e from 'express';
import { createClient, RedisClientType } from 'redis';
import winston, { Logger } from 'winston';
import { ServerConfiguration } from '../config/config';

// Data store
interface Service {
    name: string,
    address?: string
}
interface ServiceData {
    services: Service[];
}

export const registeredServices: ServiceData = {
    services: [],
}

// Redis connection object
const redisConnection = async (config: ServerConfiguration, logger: winston.Logger) => {
    // Create a connection to the redis database
    const redisClient = createClient({
        url: `redis://${config.redisIp}:${config.redisPort}`
    });

    // subscribe to keyspace changes
    let subscribeClient = redisClient.duplicate();


    // Log any Events
    redisClient.on('error', error => {
        logger.error('Redis Error: ' + error);
    });

    redisClient.on('connect', () => {
        // logger.info('Connected to Redis!');
    });

    redisClient.on('end', () => {
        // logger.info('Disconnected from Redis!');
    });

    redisClient.on('reconnecting', () => {
        logger.info('Attempting to reconnect to Redis!');
    });

    subscribeClient.on('connect', () => { logger.info('Subscribed to Redis Keyspace Changes'); });



    // Helper functions
    const GetServices = () => {
        return new Promise<void>((resolve, reject) => {
            redisClient.KEYS("genesis.broker*.*").then((results) => {
                if (results) {
                    let addressPromises: Array<any> = [];
                    results.forEach((key) => {
                        let serviceName = key.split('.')[2];
                        if (serviceName) {
                            registeredServices.services.push({ name: serviceName });
                            addressPromises.push(GetServiceAddress(serviceName));
                            logger.info(`Found register service: ${serviceName}`);
                        } else {
                            logger.error(`Could not parse service name from ${key} key`);
                        }
                    });
                    if (addressPromises.length === 0) { resolve; } else {
                        // Attempt to get all of the service addresses
                        Promise.allSettled(addressPromises).then(() => { resolve(); });
                    }
                }
            }).catch((error) => {
                logger.error(`Error in getting service names: ${error}`);
                reject();
            });
        });
    };

    const GetServiceAddress = (serviceName?: string) => {
        return new Promise<void>((resolve, reject) => {
            // Attempt to pull the address for the service from the redis database
            redisClient.get(`genesis.broker.${serviceName}`).then(result => {
                // Check for a blank result
                if (result) {
                    let serviceEntry = registeredServices.services.find((entry) => entry.name == serviceName);
                    if (serviceEntry) {
                        serviceEntry.address = result;
                        logger.info(`Found ${serviceName} address (${result})`);
                        resolve();
                    }
                    else {
                        logger.error(`Something happened to the ${serviceName} service entry while trying to find the service address.`);
                        reject();
                    }
                } else {
                    logger.error(`Nothing returned from genesis.service.${serviceName} Redis key.`);
                    reject();
                }
            }).catch(error => {
                logger.error(`Error in getting ${serviceName} address from redis: ${error}`);
                reject();
            });
        });
    }

    const UpdateService = (key: string) => {
        // Check to see if the service is already registered
        let serviceName = key.split('.')[2];
        if (serviceName) {
            if (registeredServices.services.findIndex((entry) => entry.name === serviceName) === -1) {
                // Add the service to the data structure
                registeredServices.services.push({ name: serviceName });
                logger.info(`Found register service: ${serviceName}`);
            };
            // Get the address for the service
            logger.info(`Attempting to update ${serviceName} address`);
            redisClient.connect().then(() => GetServiceAddress(serviceName).then(() => {
                redisClient.disconnect();
            }))

        } else {
            logger.error(`Could not parse service name from ${key} key`);
        }
    };

    const RemoveService = (key: string) => {
        let serviceName = key.split('.')[2];
        if (serviceName) {
            let serviceIdx = registeredServices.services.findIndex((entry) => entry.name === serviceName);
            if (serviceIdx != -1) {
                // Remove the service entry
                let removedServices = registeredServices.services.splice(serviceIdx, 1);
                logger.info(`Removed service: ${serviceName}`);
            };
        } else {
            logger.error(`Could not parse service name from ${key} key`);
        }
    };

    const ServiceSubscribeCallback = (message: string, channel: string) => {
        let key = channel.split(':')[1];
        if (key) {
            switch (message) {
                case "set":
                    UpdateService(key);
                    break;
                case "expired":
                    RemoveService(key);
                    break;
            }
        } else {
            logger.error(`Could not parse the key name from ${channel} channel`);
        }
    };

    // Get the currently active services
    redisClient.connect().then(() => {
        GetServices().then(() => {
            logger.info(`Successfully collected active services and their addresses`);
            // Register for service changes
            subscribeClient.connect().then(() => {
                console.log()
                subscribeClient.pSubscribe('*genesis.broker*', ServiceSubscribeCallback);
            });
            // Disconnect the client
            redisClient.disconnect();
        }).catch(error => {
            logger.error(`Error in getting services ${error}`);
            // Disconnect the client
            redisClient.disconnect();
        });
    });

}

// Export the redis connection object
export default redisConnection;
