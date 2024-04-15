const express = require('express');
const app = express();

const trackerEndpoint = require('./api_core/endpoint/tracker-endpoint');

app.use(express.json()); 

app.use('/api', trackerEndpoint);

const port = 2070;

app.listen(port, '0.0.0.0', () => {
    console.log(`API running on ${port}`);
});
   


   


