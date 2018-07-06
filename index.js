const express = require("express")
const app = express()
require("dotenv").config()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5000

const { createMessageAdapter } = require('@slack/interactive-messages')

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lunch-vote", (err) => {
    if (err) throw err
    console.log("Connected to the lunch-vote database!")
})

const slackInteractions = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);
app.use("/slack/actions", slackInteractions.expressMiddleware())
app.use("/slack", require("./routes/slack"))
app.use("/restaurants", require("./routes/restaurants"))

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})
