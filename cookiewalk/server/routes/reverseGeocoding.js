const express = require("express");
const axios = require('axios');
const router = express.Router();
require("dotenv").config();

var client_id = process.env.NAVER_CLIENT_ID;
var client_secret = process.env.NAVER_CLIENT_SECRET;

router.route("/").get(async function(req,res){
  const { latitude, longitude } = req.query;
  console.log(latitude,longitude)

  const url = 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc';
  const params = {
    coords: `${longitude},${latitude}`,
    orders: 'roadaddr,addr',
    output: 'json'
  };

  const headers = {
    'X-NCP-APIGW-API-KEY-ID': client_id,
    'X-NCP-APIGW-API-KEY': client_secret
  };

  try {
    const response = await axios.get(url, { params, headers });
    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching reverse geocode:', error);
    res.status(500).json({ error: 'Failed to fetch reverse geocode' });
  }
});

module.exports = router;