// index.js
import cluster from 'cluster';
import os from 'os';
import createServer from './index.js';

const PORT = process.env.PORT || 4000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running on ${PORT}`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  const startServer = async () => {
    const app = await createServer();
    app.listen(PORT, () => {
      console.log(`Worker ${process.pid} listening on port ${PORT}`);
    });
  };

  startServer();
}
