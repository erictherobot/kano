/**
 * Module dependencies.
 */

const os = require('os');
const cluster = require('cluster');

/**
 * Cluster setup.
 */

// Setup the cluster to use app.js
cluster.setupMaster({
  exec: 'app.js'
});

// Listen for dying workers
cluster.on('exit', function(worker) {
  console.log('Worker ' + worker.id + ' died');
  // Replace the dead worker
  cluster.fork();
});

// Fork a worker for each available CPU
for (let i = 0; i < os.cpus().length; i++) {
  cluster.fork();
}
