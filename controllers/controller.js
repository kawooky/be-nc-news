const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId
} = require("../models/model.js");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticles = (req, res) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id).then((article) => {
    res.status(200).send({ article });
  })
  .catch(next)
};

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  selectCommentsByArticleId(id).then((comments) => {
    res.status(200).send({ comments });
  })
  .catch(next)
};

exports.postCommentByArticleId = (req, res, next) =>{}


