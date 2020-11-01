const AWS = require('aws-sdk');
const config = require('config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const headers = {'Access-Control-Allow-Origin': '*'};

exports.handler = async (event) => {
    let username = event.requestContext.authorizer.principalId;
    return new Promise((resolve,reject)=>{
        if (typeof(username) !== "string") {
            return resolve({ headers, statusCode: 400, body: JSON.stringify({ message: "Malformed input" }) });
        }; 
        dynamoDB.query({
            TableName: config.tableName,
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        }, (err, res) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            if (res.Items.length == 0) {
                console.error("No Items Found");
                return resolve({ headers, statusCode: 404, body: JSON.stringify({ message: `Nothing for user with id ${username}` }) });
            }
            return resolve({ headers, statusCode: 200, body: JSON.stringify({ message: res.Items[0].data }) });
        });
    });
};
