const express = require("express");
const { getTopics } = require("./controllers/controller.js");
const app = express();




app.get('/api/topics', getTopics)


app.all("/*", (req, res) => {
    res.status(404).send({ message: "Not Found" });
});



module.exports = app;