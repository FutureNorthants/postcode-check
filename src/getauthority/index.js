'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});
const tableName = process.env.TABLE_NAME;

exports.lambdaHandler = async (event, context) => {
    var postcode = event.pathParameters.postcode.replace('%20', '').toUpperCase();
    console.log(postcode);
    //const item = await getCouncilByPostcode(postcode);

    return getBasicCouncilByPostcode(event);

    return {
        statusCode: 200,
        body: JSON.stringify(item)
    }
}

async function getBasicCouncilByPostcode(event) {
    var postcode = event.pathParameters.postcode.replace('%20', '').toUpperCase();
    console.log(postcode);
    var postcodeStart

    if(postcode.length==7){
        postcodeStart = postcode.substring(0,4)
    } else if(postcode.length==6){
        postcodeStart = postcode.substring(0,3)
    } else {
        return{
            statusCode:500
        }
    }

    var oldAuth;
    var newAuth;

    switch(postcodeStart){
        case "NN1":
            oldAuth = 'Northampton';
            newAuth = 'West';
            break;
        case "NN2":
            oldAuth = 'Northampton';
            newAuth = 'West';
            break;
        case "NN3":
            oldAuth = 'Northampton';
            newAuth = 'West';
            break;
        case "NN4":
            oldAuth = 'Northampton';
            newAuth = 'West';
            break;
        case "NN5":
            oldAuth = 'Northampton';
            newAuth = 'West';
            break;
        case "NN6":
            oldAuth = 'Northampton';
            newAuth = 'West';
            break;
        case "NN7":
            oldAuth = 'Northampton';
            newAuth = 'West';
            break;
        case "NN8":
            oldAuth = 'Wellingborough';
            newAuth = 'North';
            break;
        case "NN9":
            oldAuth = 'Wellingborough';
            newAuth = 'North';
            break;
        case "NN29":
            oldAuth = 'Wellingborough';
            newAuth = 'North';
            break;
        case "NN10":
            oldAuth = 'East Northants';
            newAuth = 'North';
            break;
        case "NN11":
            oldAuth = 'Daventry';
            newAuth = 'West';
            break;
        case "NN12":
            oldAuth = 'South Northants';
            newAuth = 'West';
            break;
        case "NN13":
            oldAuth = 'South Northants';
            newAuth = 'West';
            break;
        case "NN14":
            oldAuth = 'Kettering';
            newAuth = 'North';
            break;
        case "NN15":
            oldAuth = 'Kettering';
            newAuth = 'North';
            break;
        case "NN16":
            oldAuth = 'Kettering';
            newAuth = 'North';
            break;
        case "NN17":
            oldAuth = 'Corby';
            newAuth = 'North';
            break;        
        case "NN18":
            oldAuth = 'Corby';
            newAuth = 'North';
            break;
    }
    
    var body = {            
            unitary: newAuth,
            sovereign: oldAuth
    };
    return {
        statusCode: 200,
        "body": JSON.stringify(body)
    };
};

async function getCouncilByPostcode(postcode){
    let params = {
        TableName: tableName,
        KeyConditionExpression: "#postcode = :postcode",
        ExpressionAttributeNames: {
            "#postcode": "postcode"
        },
        ExpressionAttributeValues: {
            ":postcode": postcode
        }
    }

    let dbresult = await docClient.query(params).promise();

    console.log(JSON.stringify(dbresult));
    return JSON.stringify(dbresult);
}