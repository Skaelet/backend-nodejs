const parseArgs = require('minimist');
const args = parseArgs(process.argv.slice(2));
const { startMiddlewares } = require('./middlewares/index');
const express = require('express');
const app = express();
const PORT = parseInt(process.argv[2]) || 8080;
const httpServer = require("http").createServer(app);
const { startSocketConnection } = require('./middlewares/sockets');
const { getRoutes } = require('./routes');

httpServer.listen(PORT, () => console.log(`SERVER ON PORT: ${PORT}`));

startMiddlewares(app);
startSocketConnection(httpServer);

getRoutes(app);