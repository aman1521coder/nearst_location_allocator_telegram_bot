require('dotenv').config();
const axios = require('axios');
const fetch=require('axios');
const { send } = require('process');
const { text } = require('stream/consumers');
const TOkEN=process.env.TOkEN
const API_URL=`https://api.telegram.org/bot${TOkEN}`
async function sendMessage(chat_id,msg){ 
    try{
const  response=await axios.post(`${API_URL}/sendMessage`,{
    chat_id:chat_id,
    text:msg
})
if (!response.data.ok){
    throw new Error(`Error sending message: ${response.statusText}`)
}
return response.data
    }catch(error){
        console.error('Error sending message:',error)
        throw error
    }
}

async function sendKeboard(){
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "gym  ", callback_data: "gym" },
          { text: "restaurnt ", callback_data: "restuarnt" },
          { text: "hospital ", callback_data: "hospital" },
          { text: "police ", callback_data: "police" },
          { text: "school ", callback_data: "school" },
          { text: "college ", callback_data: "college" },
          { text: "library ", callback_data: "library" },
          { text: "park ", callback_data: "park" },
          { text: "market ", callback_data: "market" },
          {text: "mall ", callback_data: "mall"},
          {text: "bus stop ", callback_data: "bus stop"},
          {text:"fast food",callback_data:"fast food"}
        ],

        
      ],
    },
  };
  await sendMessage(chat_id,"choose one from the keyboard",keyboard)

  
}
