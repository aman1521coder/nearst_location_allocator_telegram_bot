require('dotenv').config();
const axios = require('axios');
const { getNearstPlace } = require('./map');

const TOkEN = process.env.TOkEN;
const API_URL = `https://api.telegram.org/bot${TOkEN}`;
let offset = 0;
const RADIUS = 300; // meters
let locationString = "";

// Send message with optional keyboard
async function sendMessage(chat_id, msg, keyboard = null) {
  try {
    const payload = { chat_id, text: msg, parse_mode: "Markdown" };
    if (keyboard) payload.reply_markup = keyboard.reply_markup;

    const response = await axios.post(`${API_URL}/sendMessage`, payload);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}

// Inline keyboard
async function sendKeyboard(chat_id) {
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Gym", callback_data: "gym" },
          { text: "Restaurant", callback_data: "restaurant" },
          { text: "Hospital", callback_data: "hospital" },
        ],
        [
          { text: "Police", callback_data: "police" },
          { text: "School", callback_data: "school" },
          { text: "Library", callback_data: "library" },
        ],
      ],
    },
  };
  await sendMessage(chat_id, "Choose one from the keyboard:", keyboard);
}

// Ask for location
async function askLocation(chatId) {
  const keyboard = {
    reply_markup: {
      keyboard: [[{ text: "📍 Send my location", request_location: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
  await sendMessage(chatId, "Please share your location 📍", keyboard);
}

// Main loop
async function getUpdates() {
  try {
    const res = await axios.get(`${API_URL}/getUpdates`, {
      params: { offset, timeout: 30 },
    });

    const updates = res.data.result;

    if (updates.length > 0) {
      for (const update of updates) {
        offset = update.update_id + 1;

        // Handle text
        if (update.message?.text === "/start") {
          await askLocation(update.message.chat.id);
        }

        // Handle location
        if (update.message?.location) {
          const loc = update.message.location;
          locationString = `${loc.latitude},${loc.longitude}`;
          await sendMessage(update.message.chat.id, "Got your location ✅");
          await sendKeyboard(update.message.chat.id);
        }

        // Handle button clicks
        if (update.callback_query) {
          const placeType = update.callback_query.data;
          const chat_id = update.callback_query.message.chat.id;

          if (!locationString) {
            await sendMessage(chat_id, "❌ I don’t know your location yet.");
            continue;
          }

          const places = await getNearstPlace(
            locationString,
            placeType,
            placeType,
            RADIUS
          );

          if (!places.results.length) {
            await sendMessage(chat_id, `No ${placeType} found nearby 😕`);
          } else {
            const place = places.results[0];
            const mapsLink = `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`;
            const message = `🏷 *Name*: ${place.name}\n📍 *Address*: ${place.vicinity}\n⭐ *Rating*: ${place.rating || "N/A"}\n[View on Google Maps](${mapsLink})`;
            await sendMessage(chat_id, message);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error getting updates:", err.message);
  }

  getUpdates(); // keep polling
}

getUpdates();
