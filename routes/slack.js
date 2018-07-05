const express = require("express")
const router = express.Router()
const { WebClient } = require('@slack/client')
const { createSlackEventAdapter } = require('@slack/events-api')
const { createMessageAdapter } = require('@slack/interactive-messages')
const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);
const cron = require("node-cron")
const { presentOptions } = require("../utils")
const Restaurant = require("../models/restaurant")

// Present the daily restaurant options at 12:20pm every weekday
// cron.schedule("20 12 * * 1-5", presentOptions)




/*
The Events API will allow the app to listen and respond to when a user clicks a button with their chosen
Restaurant. Until this is implemented, we're just displaying 5 options to the user and letting the people
in the lunch channel discuss which of those options they want.
*/
router.use("/slack/events", slackEvents.expressMiddleware())

router.post("/slack/events", (req, res) => {
    res.send({ challenge: req.body.challenge })
});
/* END Events handler section, which I may look into later */




// const slackInteractions = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);
// const web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN)
// router.use(slackInteractions.expressMiddleware())
router.get("/", (req, res) => {
    console.log("Working POST")
    res.send({message: "OK"})
})

// router.post("/", (req, res) => {
//     const lunchChannelId = process.env.LUNCH_CHANNEL_ID
//     web.dialog.open({
//         trigger_id: req.body.trigger_id,
//         dialog: {
//             callback_id: "vschool-lunch-vote",
//             title: "Add a Restaurant",
//             elements: [
//                 {
//                     label: "Restaurant Name",
//                     name: "name",
//                     type: "text"
//                 },
//                 {
//                     label: "Cuisine Type",
//                     name: "cuisine",
//                     type: "text",
//                     placeholder: "American, Mexican, Asian, Burgers, etc."
//                 }
//             ]
//
//         }
//
//     })
//
//     // web.chat.postMessage({
//     //     channel: lunchChannelId,
//     //     text: "New tests"
//     // })
//
//     // Shows the user's slash command in the chat
//     return res.send({response_type: "in_channel"})
//     // if (!req.body.text) {
//     //     web.chat.postMessage({
//     //         channel: lunchChannelId,
//     //         text: "You must "
//     //     })
//     // }
//     // const entries = req.body.text.trim().split(",").map(entry => entry.trim())
//     // const newRestaurant = entries.reduce((obj, entry) => {
//     //     const keyValPair = entry.split(":").map(keyval => keyval.trim())
//     //     if (Restaurant.schema.paths[keyValPair[0].toLowerCase()]) {  // If this is a valid property of the schema
//     //         obj[keyValPair[0].toLowerCase()] = keyValPair[1]
//     //     }
//     //     return obj
//     // }, {})
//     //
//     // const restaurantToAdd = new Restaurant(newRestaurant)
//     // restaurantToAdd.save()
//     //     .then(() => {
//     //         web.chat.postMessage({ channel: lunchChannelId, text: `Added ${restaurantToAdd.name} to the database!` })
//     //         // return res.end()
//     //     })
//     //     .catch(err => res.status(500).send(err))
// })


router.post("/slacktest", presentOptions)


module.exports = router
