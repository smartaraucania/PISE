/**
 * index.js
 * Main file.
 * Imports, DB Connection, Routes, Start Backend on PORT.
 */
var express = require("express");
var app = express();
var methodOverride = require("method-override");
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var constants = require('./util/constants');
var cors = require('cors');
var mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
var session = require('express-session');
var hpp = require('hpp');

require('inspector').close();

const PORT = process.env.PISE_BACKEND_PORT || 4000;

module.exports = app;

app.use(helmet());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'B0c4_L0_m4S_gR4nDe',
  name: 'pise_session',
  resave: false,
  saveUninitialized: true,
}));
app.use(mongoSanitize());
app.use(hpp());

connectDBWithRetry();

//MongoDB Connection with Retry
function connectDBWithRetry() {
    return mongoose.connect(constants.dbLocal, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, async function (err, res) {
        if (err) {
            console.log('Error al conectar a la Base de datos. ' + err);
            console.log('REINTENTANDO EN 5 SEGUNDOS')
            return setTimeout(connectDBWithRetry, 5000);
        }
        // If no errors. Continue the app logic
        mongoose.set('useCreateIndex', true);

        if(constants.seed == 'true'){
            mongoose.connection.db.dropDatabase();
        }

        //Load Models
        loadModels();
        await initializeRoutes();

        if(constants.seed == 'true'){
            var initData = require('./tests/initData');
            initData.createInitData();
        }
    
        //Start backend
        var server = app.listen(PORT, () => {
            console.log(`Server running on ${PORT}/`);
        }); 

        const io = require('socket.io')(server);
        global.io = io;
        io.on('connection', function(socket) {
            console.log(socket.id)
            
        });
    });
};

/**
 * Load Mongo Models
 */
function loadModels() {
    require('./models/util/country'); //Model for Country
    require('./models/util/region'); //Model for Region
    require('./models/util/commune'); //Model for Commune
    require('./models/util/actorType'); //Model for UserType
    require('./models/util/actorsGroupType'); //Model for ActorsGroupType
    require('./models/util/office'); //Model for ActorsGroupType
    require('./models/user/appUser'); //Model for AppUser
    require('./models/user/webUser'); //Model for WebUser
    require('./models/emergency/eventType'); //Model for EventType
    require('./models/emergency/emergencyType'); //Model for EmergencyType
    require('./models/emergency/emergency'); //Model for Emergency
    require('./models/emergency/emergencyEvent'); //Model for EmergencyEvent
}

function initializeRoutes() {
    //Middlewares
    var middlewares = require('./middlewares');

    //Api routes
    var authRoutes = require('./routes/authRoutes');
    app.use('/auth', middlewares.bodyErrorHandling, authRoutes);
    var adminRoutes = require('./routes/adminRoutes');
    app.use('/admin', middlewares.isAuth, middlewares.isEnabled, middlewares.hasAnyChange, middlewares.isAdmin, middlewares.bodyErrorHandling, adminRoutes);
    var utilsRoutes = require('./routes/utilsRoutes');
    app.use('/utils', middlewares.isAuth, middlewares.isEnabled, middlewares.hasAnyChange, middlewares.bodyErrorHandling, utilsRoutes);
    var usersRoutes = require('./routes/userRoutes');
    app.use('/users', middlewares.isAuth, middlewares.isEnabled, middlewares.hasAnyChange, middlewares.isSuperUser, middlewares.bodyErrorHandling, usersRoutes);
    var emergenciesRoutes = require('./routes/emergencyRoutes');
    app.use('', middlewares.isAuth, middlewares.isEnabled, middlewares.hasAnyChange, middlewares.bodyErrorHandling, emergenciesRoutes);
}