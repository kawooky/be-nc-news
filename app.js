const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers/controller.js");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});


// Handles PSQL errors
app.use((err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ message: "Bad Request" });
	} else {
		next(err);
	}
});

// Handles custom errors
app.use((err, req, res, next) => {
	if ("status" in err) {
		res.status(err.status).send({ message: err.msg });
		return;
	} else {
		next(err);
	}
});

// Unhandled errors
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send({ message: "Unhandled Server Error" });
});

module.exports = app;
