const config = require('config'),
    port = config.get('server.port'),
    dbName = config.get('db.name');

const {bootstrap} = require('./server/server')

async function runApp() {
    const app = await bootstrap(port, 'dbHost', dbName);
    return app; 
}

(async ()=> {
    await runApp();
})();

module.exports = { runApp }
