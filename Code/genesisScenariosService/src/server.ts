import app, { commonLogger } from "./app";
import ServerConfig from "./config/config";
import connectToMySql from "./database/mysqlDatabase";
import redisConnection from "./database/redisDatabase";

// Connect to the database
connectToMySql(ServerConfig.dbHostIp, ServerConfig.dbUsername, ServerConfig.dbPassword, ServerConfig.dbSchema)
    .then(() => { commonLogger.info(`Successfully connected to database at ${ServerConfig.dbHostIp}`); })
    .catch((error) => { commonLogger.error(`Failed to connect to database at ${ServerConfig.dbHostIp} because ${error}`) });

// Connect to redis database
redisConnection(ServerConfig, commonLogger);

// Start the server listening on our port
app.listen(ServerConfig.port, () => {
    commonLogger.info(`Genesis Scenario Service Started, Listening on port ${ServerConfig.port}`);
})