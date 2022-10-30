const { startMiddlewares } = require('./middlewares/index');
const express = require('express');
const app = express();
const PORT = 8080;
const httpServer = require("http").createServer(app);
const { startSocketConnection } = require('./middlewares/sockets');
const { getRoutes } = require('./routes');

httpServer.listen(PORT, () => console.log("SERVER ON"));

startMiddlewares(app);
startSocketConnection(httpServer);

getRoutes(app);