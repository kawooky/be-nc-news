const {
  selectTopics,
  selectArticles,
  selectArticleById,
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
