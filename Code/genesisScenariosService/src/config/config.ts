export interface ServerConfiguration {
    port: number;
    dbHost: string;
    dbUser: string;
    dbPassword: string;
    dbSchema: string;
}

const ServerConfig: ServerConfiguration = {
    port: 8000,
    dbHost: '172.28.224.120',
    dbUser: 'root',
    dbPassword: 'RootersKewl!234',
    dbSchema: 'genesis_scenarios'
};

export default ServerConfig;