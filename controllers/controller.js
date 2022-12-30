const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleVotes,
  selectUsers,
  deleteCommentById,
} = require("../models/model.js");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  selectArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  selectCommentsByArticleId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  const usernameAndBody = req.body;
  insertCommentByArticleId(id, usernameAndBody)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const id = req.params.article_id;
  const votesObj = req.body;
  updateArticleVotes(id, votesObj)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};


exports.removeCommentById = (req, res, next) => {
	const id = req.params.comment_id;

	deleteCommentById(id)
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};