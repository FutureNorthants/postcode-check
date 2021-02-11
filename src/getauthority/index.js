'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});
const tableName = process.env.TABLE_NAME;
const osKey = process.env.OS_API_KEY;
const axios = require('axios').default;
var turf = require('@turf/turf');
var boundaryData = require('NCCAllAreasExport.json');

exports.lambdaHandler = async (event, context) => {
    //format postcode
    var postcode = event.pathParameters.postcode.replace('%20', '').toUpperCase();

    var result = await checkPolygon(postcode)

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}

async function checkPolygon(postcode){
    //get coordinates for postcode
    //get the data for the postcode
    var postcodeData = await axios.get(`https://api.ordnancesurvey.co.uk/places/v1/addresses/postcode?postcode=${postcode}&key=${osKey}&dataset=DPA&output_SRS=EPSG:4326`)
    var results = postcodeData.data.results;
    var coordArray = [];

    // //loop through the data and put each coordinate in an array
    // results.forEach(element => {
    //     coordArray.push([element.DPA.LNG, element.DPA.LAT])
    // });
    // //put the first coordinate at the end so it joins up
    // coordArray.push([results[0].DPA.LNG, results[0].DPA.LAT])
    // var polygon = turf.polygon([coordArray], {name:'postcodePoly'})
    // console.log(polygon);
    
    //empty array for a list 
    var sovAuthResult = [];
    var addressList = [];
    var unitary = [];

    //loop through each set of coordinates for each council and check if it is inside
    boundaryData.forEach(boundaryDataItem => {
        // loop through and create permeter for local auth
        var authPolygon = turf.polygon(boundaryDataItem.geometry.coordinates, {name:'authPoly'})

        results.forEach(function(result, index, array) {
            var crosses = turf.booleanPointInPolygon([result.DPA.LNG, result.DPA.LAT], authPolygon)
            if (crosses){
                var unitaryItem = getUnitary(boundaryDataItem.NAME)
                var sovereignCode = getSovereignCode(boundaryDataItem.NAME)
                result.DPA["SOVEREIGN_COUNCIL_NAME"] = boundaryDataItem.NAME;
                result.DPA["SOVEREIGN_COUNCIL_CODE"] = sovereignCode;
                result.DPA["UNITARY_COUNCIL_NAME"] = unitaryItem.unitary;
                result.DPA["UNITARY_COUNCIL_CODE"] = unitaryItem.unitaryCode;
                addressList.push(result);

                if(sovAuthResult.some(item => item.sovereignName === boundaryDataItem.NAME)===false){
                    sovAuthResult.push({sovereignName: boundaryDataItem.NAME, sovereignCode: sovereignCode});
                    if(unitary.some(item => item.unitary === unitaryItem.unitary)===false){
                        unitary.push(unitaryItem);
                    }
                }

                
            }
        });
            
    })

    return {
        numOfSovereign: sovAuthResult.length,
        sovereign: sovAuthResult,
        numOfUnitary: unitary.length,
        unitary: unitary,
        addresses: addressList
    }
    //check to see if it is only in one. if it is return that council
    // if it is in more than one loop through each address and get which authority each point is inside and return the list.
}

//Basic function now unused
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

function getUnitary(sovereignAuthority){
    var unitaryCode;
    var unitary;
    switch(sovereignAuthority){
        case "SOUTH NORTHAMPTONSHIRE COUNCIL":
            unitary = 'WNC';
            unitaryCode = 2;
            break;
        case "DAVENTRY DISTRICT COUNCIL":
            unitary = 'WNC';
            unitaryCode = 2;
            break;
        case "NORTHAMPTON BOROUGH":
            unitary = 'WNC';
            unitaryCode = 2;
            break;
        case "BOROUGH COUNCIL OF WELLINGBOROUGH":
            unitary = 'NNC';
            unitaryCode = 1;
            break;
        case "EAST NORTHAMPTONSHIRE COUNCIL":
            unitary = 'NNC';
            unitaryCode = 1;
            break;
        case "KETTERING BOROUGH COUNCIL":
            unitary = 'NNC';
            unitaryCode = 1;
            break;
        case "CORBY BOROUGH":
            unitary = 'NNC';
            unitaryCode = 1;
            break;
    }

    return {
        unitary: unitary,
        unitaryCode: unitaryCode
    }
}

function getSovereignCode(sovereignAuthority){
    var sovereignCode;
    switch(sovereignAuthority){
        case "SOUTH NORTHAMPTONSHIRE COUNCIL":
            sovereignCode = 6;
            break;
        case "DAVENTRY DISTRICT COUNCIL":
            sovereignCode = 2;
            break;
        case "NORTHAMPTON BOROUGH":
            sovereignCode = 5;
            break;
        case "BOROUGH COUNCIL OF WELLINGBOROUGH":
            sovereignCode = 7;
            break;
        case "EAST NORTHAMPTONSHIRE COUNCIL":
            sovereignCode = 3;
            break;
        case "KETTERING BOROUGH COUNCIL":
            sovereignCode = 4;
            break;
        case "CORBY BOROUGH":
            sovereignCode = 1;
            break;
    }

    return sovereignCode
}