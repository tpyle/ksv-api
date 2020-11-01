const AWS = require('aws-sdk');
const config = require('config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const headers = {'Access-Control-Allow-Origin': '*'};

exports.handler = async (event) => {
    // TODO implement
    console.log(JSON.stringify(event));
    let username = event.requestContext.authorizer.principalId;
    let data = event.body;
    return new Promise((resolve,reject)=>{
        if (typeof(username) !== "string" || typeof(data) !== "string") {
            return resolve({ headers, statusCode: 400, body: JSON.stringify({ message: "Malformed input" }) });
        };
        try {
            dynamoDB.put({
                TableName: config.tableName,
                Item: {
                    username,
                    data
                }
            }, (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve({ headers, statusCode: 200, body: JSON.stringify({ message: data }) });
            });
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};

