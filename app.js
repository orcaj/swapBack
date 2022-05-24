const express = require("express");
const cors = require("cors");
const app = express();

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route

const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'local';
dotenv.config({ path: env + '.env' });


var corsOptions = {
    origin: [process.env.FRONT_URL, 'http://staging.recoveryswap.finance']
};
app.use(cors(corsOptions));

const db = require('./server/models');
db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});



const indexRoute = require('./server/routes');

app.use('/api/', indexRoute);


const uploadInfo = require('./server/cronjob/uploadInfo');

var cron = require('node-cron');
cron.schedule('5 * * * *', () => {
    console.log('time:', new Date())
    uploadInfo();
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
