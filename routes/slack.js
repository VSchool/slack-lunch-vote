const express = require("express")
const router = express.Router()
const { createSlackEventAdapter } = require('@slack/events-api')
const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);
const cron = require("node-cron")
const { presentOptions } = require("../utils")
const Restaurant = require("../models/restaurant")

cron.schedule("20 12 * * 1-5", presentOptions)

router.use("/slack/events", slackEvents.expressMiddleware())

router.post("/slack/events", (req, res) => {
    res.send({ challenge: req.body.challenge })
});

router.post("/", (req, res) => {
    const entries = req.body.text.trim().split(",").map(entry => entry.trim())
    const newRestaurant = entries.reduce((obj, entry) => {
        const keyValPair = entry.split(":").map(keyval => keyval.trim())
        if (Restaurant.schema.paths[keyValPair[0].toLowerCase()]) {  // If this is a valid property of the schema
            obj[keyValPair[0].toLowerCase()] = keyValPair[1]
        }
        return obj
    }, {})

    const restaurantToAdd = new Restaurant(newRestaurant)
    restaurantToAdd.save()
        .then(() => {
            const web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN)
            const lunchChannelId = process.env.LUNCH_CHANNEL_ID
            web.chat.postMessage({ channel: lunchChannelId, text: `Added ${restaurantToAdd.name} to the database!` })
            return res.end()
        })
        .catch(err => res.status(500).send(err))
})


router.post("/slacktest", presentOptions)


module.exports = router
