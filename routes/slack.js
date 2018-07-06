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
// router.use("/slack/events", slackEvents.expressMiddleware())
//
// router.post("/slack/events", (req, res) => {
//     res.send({ challenge: req.body.challenge })
// });
/* END Events handler section, which I may look into later */

const web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN)

const slackInteractions = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);
router.use("/actions", slackInteractions.expressMiddleware())

slackInteractions.action("vschool_lunch_vote_add_restaurant", (payload, respond) => {
    const restaurantToAdd = new Restaurant(payload.submission)
    restaurantToAdd.save()
        .then(() => {
            respond({ response_type: "in_channel", text: `${payload.user.name} added ${restaurantToAdd.name} to the database.` })
        })
        .catch(err => res.status(500).send(err))
    respond({ text: "Awesome! Thanks for adding to the lunch database!" })
})

// slackInteractions.action("lunch_vote_get_restaurants_list", (payload, respond) => {
//     Restaurant.find((err, list) => {
//
//     })
// })

router.post("/commands", (req, res) => {
    const lunchChannelId = process.env.LUNCH_CHANNEL_ID
    const command = req.body.text.split(" ")[0]
    if (command === "add") {
        web.dialog.open({
            trigger_id: req.body.trigger_id,
            dialog: {
                callback_id: "vschool_lunch_vote_add_restaurant",
                title: "Add a Restaurant",
                elements: [
                    {
                        label: "Restaurant Name",
                        name: "name",
                        type: "text"
                    },
                    {
                        label: "Cuisine Type",
                        name: "cuisine",
                        type: "text",
                        placeholder: "American, Mexican, Asian, Burgers, etc."
                    }
                ]

            }

        })
        return res.end()
    } else if(command === "list") {
        Restaurant.find((err, list) => {
            if (err) return res.status(500).send({text: "There was an error. Please let Bob know something is wrong."})
            const displayList = list.map(item => item.name).join(", ")
            return res.send({
                channel: lunchChannelId,
                text: displayList,
                user: req.body.user_id
            })
        })
    } else {
        return res.send("Must put 'add' or 'list' after your slash command")
    }
})


router.post("/slacktest", presentOptions)


module.exports = router
