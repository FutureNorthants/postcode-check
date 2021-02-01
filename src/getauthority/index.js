'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});
const tableName = process.env.TABLE_NAME;
const osKey = process.env.OS_API_KEY;
const axios = require('axios').default;
var turf = require('@turf/turf');
var boundaryData = require('NCCAllAreasExport.json');

exports.lambdaHandler = async (event, context) => {

    boundaryData.forEach(element => {
        console.log(element.NAME);
    });
    //format postcode
    var postcode = event.pathParameters.postcode.replace('%20', '').toUpperCase();

    await checkPolygon(postcode)

    return getBasicCouncilByPostcode(event);

    return {
        statusCode: 200,
        body: JSON.stringify(item)
    }
}

async function checkPolygon(postcode){
    //get coordinates for postcode
    //get the data for the postcode
    var postcodeData = await axios.get(`https://api.ordnancesurvey.co.uk/places/v1/addresses/postcode?postcode=${postcode}&key=${osKey}&dataset=DPA&output_SRS=EPSG:4326`)
    var results = postcodeData.data.results;
    var coordArray = [];

    //loop through the data and put each coordinate in an array
    results.forEach(element => {
        coordArray.push([element.DPA.LNG, element.DPA.LAT])
    });
    //put the first coordinate at the end so it joins up
    coordArray.push([results[0].DPA.LNG, results[0].DPA.LAT])
    var polygon = turf.polygon([coordArray], {name:'postcodePoly'})
    console.log(polygon);
    
    //loop through each set of coordinates for each council and check if it is inside
    console.log(boundaryData[0].geometry.coordinates);

    var authPolygon = turf.polygon(boundaryData[0].geometry.coordinates, {name:'authPoly'})
    console.log(authPolygon);

    var crosses = turf.booleanPointInPolygon([results[0].DPA.LNG, results[0].DPA.LAT], authPolygon)

    console.log(crosses);

    // boundaryData.forEach(element => {
            
    //     })
    //check to see if it is only in one. if it is return that council
    // if it is in more than one loop through each address and get which authority each point is inside and return the list.
}

async function getBasicCouncilByPostcode(event) {
    var postcode = event.pathParameters.postcode.replace('%20', '').toUpperCase();
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
    var sovereignCode;
    var unitaryCode;

    switch(postcodeStart){
        case "NN1":
            oldAuth = 'Northampton';
            newAuth = 'West';
            sovereignCode = 5;
            unitaryCode = 2;
            break;
        case "NN2":
            oldAuth = 'Northampton';
            newAuth = 'West';
            sovereignCode = 5;
            unitaryCode = 2;
            break;
        case "NN3":
            oldAuth = 'Northampton';
            newAuth = 'West';
            sovereignCode = 5;
            unitaryCode = 2;
            break;
        case "NN4":
            oldAuth = 'Northampton';
            newAuth = 'West';
            sovereignCode = 5;
            unitaryCode = 2;
            break;
        case "NN5":
            oldAuth = 'Northampton';
            newAuth = 'West';
            sovereignCode = 5;
            unitaryCode = 2;
            break;
        case "NN6":
            oldAuth = 'Northampton';
            newAuth = 'West';
            sovereignCode = 5;
            unitaryCode = 2;
            break;
        case "NN7":
            oldAuth = 'Northampton';
            newAuth = 'West';
            sovereignCode = 5;
            unitaryCode = 2;
            break;
        case "NN8":
            oldAuth = 'Wellingborough';
            newAuth = 'North';
            sovereignCode = 7;
            unitaryCode = 1;
            break;
        case "NN9":
            oldAuth = 'Wellingborough';
            newAuth = 'North';
            sovereignCode = 7;
            unitaryCode = 1;
            break;
        case "NN29":
            oldAuth = 'Wellingborough';
            newAuth = 'North';
            sovereignCode = 7;
            unitaryCode = 1;
            break;
        case "NN10":
            oldAuth = 'East Northants';
            newAuth = 'North';
            sovereignCode = 3;
            unitaryCode = 1;
            break;
        case "NN11":
            oldAuth = 'Daventry';
            newAuth = 'West';
            sovereignCode = 2;
            unitaryCode = 2;
            break;
        case "NN12":
            oldAuth = 'South Northants';
            newAuth = 'West';
            sovereignCode = 6;
            unitaryCode = 2;
            break;
        case "NN13":
            oldAuth = 'South Northants';
            newAuth = 'West';
            sovereignCode = 6;
            unitaryCode = 2;
            break;
        case "NN14":
            oldAuth = 'Kettering';
            newAuth = 'North';
            sovereignCode = 4;
            unitaryCode = 1;
            break;
        case "NN15":
            oldAuth = 'Kettering';
            newAuth = 'North';
            sovereignCode = 4;
            unitaryCode = 1;
            break;
        case "NN16":
            oldAuth = 'Kettering';
            newAuth = 'North';
            sovereignCode = 4;
            unitaryCode = 1;
            break;
        case "NN17":
            oldAuth = 'Corby';
            newAuth = 'North';
            sovereignCode = 1;
            unitaryCode = 1;
            break;        
        case "NN18":
            oldAuth = 'Corby';
            newAuth = 'North';
            sovereignCode = 1;
            unitaryCode = 1;
            break;
    }
    
    var body = {            
            unitary: newAuth,
            unitaryCode: unitaryCode,
            sovereign: oldAuth,
            sovereignCode: sovereignCode

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