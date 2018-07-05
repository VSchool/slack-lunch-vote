const { WebClient } = require('@slack/client')
const Restaurant = require("../models/restaurant")

function presentOptions(req, res) {
    const web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN)
    const lunchChannelId = process.env.LUNCH_CHANNEL_ID
    Restaurant.find()
        .sort("numVisits")
        .exec((err, options) => {
            if (err) {
                console.log("PROBLEMZ")
                if (res) return res.status(500).send(err)
                throw err
            }

            let weightedOpts = []
            const maxVal = options[options.length - 1].numVisits
            for (let option of options) {
                const tempArray = new Array(maxVal - option.numVisits + 1).fill(option.name)
                weightedOpts.push(...tempArray)
            }

            const finalOpts = []

            for (let i = 0; i < 5; i++) {
                const rand = Math.floor(Math.random() * weightedOpts.length)
                const chosen = weightedOpts[rand]
                finalOpts.push(chosen)
                weightedOpts = weightedOpts.filter(opt => opt !== chosen)
            }

            // console.log(finalOpts)

            // options.sort((a, b) => a.numVisits > b.numVisits)
            // options = options.slice(0, 5)

            const message = {
                channel: lunchChannelId,
                text: "<!channel> Which place would you like to go? Here are today's options. Discuss!",
                attachments: []
            }
            for (let option of finalOpts) {
                const attachment = {
                    text: option,
                    color: "#3AA3E3",
                    attachment_type: "default",
                }
                message.attachments.push(attachment)
            }
            web.chat.postMessage(message)
                .then(response => {
                    // `res` contains information about the posted message
                    console.log(`Posted to Slack! ${response.ts}`)
                    if (res) return res.end()
                })
                .catch(err => {
                    console.error(err)
                })
        })


    // For when I want to add interactive buttons. For now, we'll use emoji votes
    // const message = {
    //     channel: lunchChannelId,
    //     text: "Which place would you like to go?",
    //     attachments: [
    //         {
    //             text: "Choose a restaurant",
    //             fallback: "You are unable to choose a restaurant",
    //             color: "#3AA3E3",
    //             attachment_type: "default",
    //             actions: []
    //         }
    //     ]
    // }
    // for (option of options) {
    //     const action = {
    //         name: "restaurant",
    //         text: option.name,
    //         type: "button",
    //         value: option.name.toLowerCase()
    //     }
    //     message.attachments[0].actions.push(action)
    // }
    // // console.log(message)
    // web.chat.postMessage(message)
    //     .then(response => {
    //         // `res` contains information about the posted message
    //         console.log(response)
    //         return res.end()
    //     })
    // })
}

module.exports = {
    presentOptions
}