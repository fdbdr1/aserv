const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const PORT = process.env.PORT || 8080;
const getKeyEndpoint = "http://localhost:8082/get";
const getValuesEndpoint = "http://localhost:8083/get";

const app = express();
app.use(bodyParser.json());
app.set({'json escape': true});

let collection = new Array();

// app.post('', (req, res) => {
//     console.log(Math.floor(new Date().getTime()) + " [POST] " + req.url + "\t" + JSON.stringify(req.body));
// });

app.post('/get', (req, res) => {
    console.log(Math.floor(new Date().getTime()) + " [POST] " + req.url + "\t" + JSON.stringify(req.body));

    let requestObject = req.body;
    let contentId = requestObject.contentId;
    console.log(contentId);

    Promise.all([
        axios.post(getKeyEndpoint, requestObject),
        axios.post(getValuesEndpoint, requestObject)
    ])
    .then((responses) => {
        let contentObject = responses[0].data;
        contentObject.data = responses[1].data;
        collection.push(contentObject);
        res.send(collection);
    })
    .catch(error => {
        console.log(error);
    });


});

app.listen(PORT, () => {console.log(Math.floor(new Date().getTime()) + ` listening on port ${PORT}...`)});