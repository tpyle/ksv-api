const lib = require('./lib');
let data;

// Lambda function index.handler - thin wrapper around lib.authenticate
module.exports.handler = async (event) => {
    try {
        data = await lib.authenticate(event);
    }
    catch (err) {
        console.error(err);
        return `Unauthorized: ${err.message}`;
    }
    console.log(data);
    return data;
};
