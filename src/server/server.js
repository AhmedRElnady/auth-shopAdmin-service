
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const app = express();
const {connect} = require('../config/db/mongoose');

const shopAdminRoutes = require('../api/controllers/shopAdmin.controller')

function bootstrap(port, dbHost, dbName) {
   return new Promise(async (resolve, reject) => {
    const dbInstance = await connect(dbHost, dbName);

    app.use((req, res, next)=> {
        req.db = dbInstance;
        next();
    });

    app.use('/', (req, res, next) => {

        let contype = req.headers['content-type'];
        if (contype && !((contype.includes('application/json') || contype.includes('multipart/form-data'))))
            return res.status(415).send({ error: 'Unsupported Media Type (' + contype + ')' });
    
        next();
    });


    app.use(bodyParser.json({ limit: '100mb'}));
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use('/shop-admins', shopAdminRoutes);


    
    process.on('uncaughtException', (err)=> {
        console.log(">>>> err ", err);
    });

    process.on('unhandledRejection', (err)=> {
        console.log(">>> .... err .... >>>>", err);
    })

    const server = app.listen(port, ()=> {
        console.log(`.... Shop-Admins server started on port ${port} ....`)
             
    })
    resolve(server); 
   })   
}

module.exports = { bootstrap };