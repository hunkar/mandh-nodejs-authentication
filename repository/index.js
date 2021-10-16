const { createConnection } = require('mandh-mongoose-adapter').mongoose;
const user = require('./user');
const models = require('./models');
let isConnected = false, startConnection = false;

const initialize = (connectionString, dbName) => {
    if(startConnection || isConnected)
        return;

    startConnection = true;

    dbName = dbName || "MandhUser";

    createConnection({
        dbName,
        connectionString: connectionString,
        onConnection: async () => {
            startConnection = false;
            isConnected = true;

            models.forEach(model => {
                model.initModel(dbName);
            });
        },
        onError: (err) => {
            startConnection = false;
            isConnected = false;

            console.log("error", err)
        }
    }, "MandhUser")
}


module.exports = {
    initialize,
    repositories: {
        user,
    },
}
