const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = () => {
  const articleQuery =
    "SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count " +
    "FROM articles " +
    "LEFT JOIN comments " +
    "ON articles.article_id = comments.article_id " +
    "GROUP BY articles.article_id " +
    "ORDER BY created_at DESC;";

  return db.query(articleQuery).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      return rows[0];
    })
    .then((article) => {
      if (article === undefined) {
        return Promise.reject({
          status: 404,
          message: "Not Found",
        });
      } else {
        return article;
      }
    });
};

exports.selectCommentsByArticleId = (id) => {
  return db
    .query("SELECT comment_id, body, votes, author, created_at FROM comments WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      return rows;
    })
    .then((comments) => {
      if (comments === undefined) {
        return Promise.reject({
          status: 404,
          message: "Not Found",
        });
      } else {
        return comments;
      }
    });
};
