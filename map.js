import axios, { Axios } from "axios";
require('dotenv').config();
MAP_KEY=process.env.GOOGEL_MAP_API_KEY
MAP_API=`https://maps.googleapis.com/maps/api/place/nearbysearch/json`
//getting a nerast location from google api

async function getNearstPlace(location,type,keywword,radius){
    try{    
    const res = await axios.get(MAP_API, {
      params: {
        location,
        radius,
        type,
        keyword,
        key: MAP_KEY,
      },
    });

      return res.data

}catch(error){
    if (error.response){
    console.error('Error fetching data from Google Maps API:',error)
    throw error
}
  

}
}
module.exports={getNearstPlace}

