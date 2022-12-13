const express = require("express");
const { getTopics , getArticles} = require("./controllers/controller.js");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});


module.exports = app;
