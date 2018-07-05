const mongoose = require("mongoose")
const { presentOptions } = require("./utils")

const date = new Date()
const day = date.getDay()
const weekdays = [1, 2, 3, 4, 5]
if (weekdays.includes(day)) {
    if (mongoose.connection.readyState !== 1) {
        mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lunch-vote", (err) => {
            if (err) throw err
            console.log("Connected to the db!")
            require("dotenv").config()
            presentOptions()
            console.log("Done!")
        })
    }
}