const parseArgs = require('minimist');
const args = parseArgs(process.argv.slice(2));
const { startMiddlewares } = require('./middlewares/index');
const express = require('express');
const app = express();
const PORT = args.port || 8080;
const MODO = args.modo || 'FORK';
const httpServer = require("http").createServer(app);
const { startSocketConnection } = require('./middlewares/sockets');
const { getRoutes } = require('./routes');
const threads = require('os').cpus().length;
const cluster = require('cluster');

if (MODO === 'FORK') {
  httpServer.listen(PORT, () => console.log("SERVER ON"));
} else {
  if (cluster.isPrimary) {
    httpServer.listen(PORT, () => console.log("SERVER ON"));
  } else {
    for (let i = 0; i < threads; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    })
  }
}

startMiddlewares(app);
startSocketConnection(httpServer);

getRoutes(app);