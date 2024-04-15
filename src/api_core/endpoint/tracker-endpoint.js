const express = require('express');
const router  = express.Router();
const { getUserDataCurrent } = require('../scraping/valorantUserLookup.js');
router.use(express.json()); 

router.get('/v1/tracker/valUserSearch/:param1/:param2', async (req, res) => {
    const param1 = req.params.param1;
    const param2 = req.params.param2;
    let data = await getUserDataCurrent([param1, param2]);
    
    switch(data) {
        case 404:
            return res.status(404).send("404 User not found");
        case 451:
            return res.status(451).send("451 Uavailable for legal reasons");
        case 500:
            return res.status(500).send("500 Internal server error");
    }
    
    res.json(data);

    //to do: Change from puppet to axios
    
});

router.get('/track', (req, res) => {
    console.log('Visited /api/track');
    res.send('Tracking data');
});

module.exports = router;