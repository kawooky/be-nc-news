const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleVotes,
  getUsers
} = require("./controllers/controller.js");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/users", getUsers);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

// Handles PSQL errors
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  } else if (err.code === "23503") {
	res.status(404).send({ message: "Not Found" });
  } else if (err.code === "23502") {
	res.status(400).send({ message: "Bad Request" });
  }else {
    next(err);
  }
});

// Handles custom errors
app.use((err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).send({ message: err.message });
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
