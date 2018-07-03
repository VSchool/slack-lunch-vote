const {Router} = require("express")
const restaurantRouter = Router()
const Restaurant = require("../models/restaurant")

restaurantRouter.get("/", (req, res) => {
    Restaurant.find()
        .then(restaurants => res.send(restaurants))
        .catch(err => res.status(500).send(err))
})

restaurantRouter.post("/", (req, res) => {
    const newRest = new Restaurant(req.body)
    newRest.save()
        .then(saved => res.status(201).send(saved))
        .catch(err => res.status(500).send(err))
})

module.exports = restaurantRouter