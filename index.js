const express = require("express")
const app = express()
require("dotenv").config()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 3000

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost/lunch-vote", (err) => {
    if (err) throw err
    console.log("Connected to the lunch-vote database!")
})

app.use("/restaurants", require("./routes/restaurants"))
app.use(require("./routes/slack"))

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})
