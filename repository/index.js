const { createConnection } = require('mandh-mongoose-adapter').mongoose;
const user = require('./user');
const models = require('./models');

const initialize = (connectionString, dbName) => {
    dbName = dbName || "MandhUser";

    createConnection({
        dbName,
        connectionString: connectionString,
        onConnection: async () => {
            models.forEach(model => {
                model.initModel(dbName);
            });
        },
        onError: (err) => {
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
