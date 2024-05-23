const express = require("express");
const axios = require('axios');
const router = express.Router();
require("dotenv").config();


var client_id = process.env.NAVER_CLIENT_ID;
var client_secret = process.env.NAVER_CLIENT_SECRET;

const baseUrl='https://naveropenapi.apigw.ntruss.com/map-static/v2/raster';
const exurl='https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=16'

router.route("/").get(async function(req,res){
  const { center_longitude, center_latitude, zoom, size, path } = req.query;
  console.log(center_longitude,center_latitude, zoom, size, path)
  const centerParam = `center=${center_longitude},${center_latitude}`;
  const zoomParam = `level=${zoom}`;
  const sizeParam = `w=${size.split('x')[0]}&h=${size.split('x')[1]}`;;
  const pathParam = path ? `&path=${encodeURIComponent(`polyline|${path}`)}` : '';
  const url =`${baseUrl}?${sizeParam}&${centerParam}&${zoomParam}${pathParam}`
  console.log("Request URL:", url)
  const headers = {
    'X-NCP-APIGW-API-KEY-ID': client_id,
    'X-NCP-APIGW-API-KEY': client_secret
  };
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer', 
      headers: headers,
    });
    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching static map:', error);
    res.status(500).send('Error fetching static map');
  }
})

module.exports = router;