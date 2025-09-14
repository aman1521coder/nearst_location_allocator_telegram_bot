require('dotenv').config();
const axios = require('axios');
const fetch=require('axios')
const TOkEN=process.env.TOkEN
const API_URL=`https://api.telegram.org/bot${TOkEN}`
async function sendMessage(chat_id,msg){ 
const  response=await axios.post(`${API_URL}/sendMessage`,{
    chat_id:chat_id,
    text:msg
})
if (!response.data.ok){
    throw new Error(`Error sending message: ${response.statusText}`)
}
return response.data
}



