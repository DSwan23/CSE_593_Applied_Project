export interface ServerConfiguration {
    port: number;
    dbHostIp: string;
    dbUsername: string;
    dbPassword: string;
    dbSchema: string;
    redisIp: string;
    redisPort: number;
    debug: boolean;
    keepAliveSecs: number;
}

/**
 * Allows the user to define the variables required by this service to operate wihtin any network.
 */
const ServerConfig: ServerConfiguration = {
    port: 8001,
    dbHostIp: 'localhost',
    dbUsername: 'doug',
    dbPassword: 'RubutsKewl!234',
    dbSchema: 'genesis_scenarios',
    redisIp: 'localhost',
    redisPort: 6379,
    debug: true,
    keepAliveSecs: 30,
};

export default ServerConfig;