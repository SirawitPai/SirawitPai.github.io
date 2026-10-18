/* Start the local server, run the Postman collection with Newman, then stop the server. */
const path = require('path');
const newman = require('newman');
const { createServer } = require('./serve');

const PORT = 8080;
const root = path.resolve(__dirname, '..');
const server = createServer().listen(PORT, () => {
  newman.run({
    collection: require(path.join(root, 'postman/portfolio.postman_collection.json')),
    environment: require(path.join(root, 'postman/local.postman_environment.json')),
    reporters: ['cli'],
  }, (err, summary) => {
    server.close();
    const failed = err || summary.run.failures.length > 0;
    process.exit(failed ? 1 : 0);
  });
});
