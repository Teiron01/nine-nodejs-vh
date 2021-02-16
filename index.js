const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//catch invalid json body from body-parser
app.use(function(error, req, res, next) { 
    if(error.status = 400){
        sendError(res);
    } else {
        console.log(error);
    }
});

app.get('/', (req, res) => {
    res.send('Hello Nine Dev Team, from Vincent Hong!');
});

// Function to filter and remove non required columns
function getDrmAndCount(data){
    //filter condition drm = true and episodeCount > 0
    const drmAndCount = d => d.drm === true && d.episodeCount > 0;
    data = data.filter(drmAndCount);

    //remove known fields
    //keeps: image, slug and title
    const removeCol = ["country", "description", "drm", "episodeCount", "genre", "language", "nextEpisode", "primaryColour", "seasons", "tvChannel"];
    data.forEach(element => {
        removeCol.forEach(col =>{
            delete element[col];
        });
        element["image"] = element["image"]["showImage"];
    }); 

    //insert array into response body
    r = { "response": []  };

    r["response"] = data;
    return r;
}

//Repond with custom json error
function sendError(res){
    responseBody = {"error": "Could not decode request: JSON parsing failed"};
    res.status(400);
    res.json(responseBody);
}

//Send json response
function sendJson(res, responseBody){
    res.status(200);
    res.json(responseBody);
}

//Filter api endpoint definition
app.post('/filter', (req, res) => {
    try{
        //check if payload exists in body else respond with error
        var myArray = req.body['payload'];
        if (Object.keys(myArray).length > 0){
            res.status(200);

            //filter body to drm = true and episode count > 0
            responseBody = getDrmAndCount(myArray);

            //send response
            sendJson(res, responseBody);
        } else {
            sendError(res);
        }
    } catch (error) {
        sendError(res);
    }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));