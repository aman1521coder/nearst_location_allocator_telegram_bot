import axios, { Axios } from "axios";
require('dotenv').config();
MAP_KEY=process.env.GOOGEL_MAP_API_KEY
MAP_API=`https://maps.googleapis.com/maps/api/place/nearbysearch/json`
//getting a nerast location from google api

async function getNearstPlace(location,type,keywword,radius){
    try{   
    const res=axios.get(`${MAP_API}?location=${location}&radius=${radius}&type=${type}&keyword=${keywword}&key=${MAP_KEY}`)
    if (res.status!==200){
        throw new Error(`Error fetching data from Google Maps API: ${res.statusText}`)
    }
      return res.data

}catch(error){
    console.error('Error fetching data from Google Maps API:',error)
    throw error
}
  

}
module.exports={getNearstPlace}

