const mongoose = require("mongoose")

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastVisited: Date,
    numVisits: {
        type: Number,
        default: 0
    },
    cuisine: String
})

module.exports = mongoose.model("Restaurant", restaurantSchema)