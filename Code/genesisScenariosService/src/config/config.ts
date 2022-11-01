export interface ServerConfiguration {
    port: number;
    dbHostIp: string;
    dbUsername: string;
    dbPassword: string;
    dbSchema: string;
    redisIp: string;
    redisPort: number;
    debug: boolean;
}

const ServerConfig: ServerConfiguration = {
    port: 8000,
    dbHostIp: '172.29.175.215',
    dbUsername: 'root',
    dbPassword: 'RootersKewl!234',
    dbSchema: 'genesis_scenarios',
    redisIp: '172.29.175.215',
    redisPort: 6379,
    debug: true,
};

export default ServerConfig;